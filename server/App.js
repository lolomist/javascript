const http = require('http');
const express = require('express');
const router = express.Router();
const socketIO = require('socket.io');
const mongoose = require('mongoose');
//const keys = require('./config/keys');
//require('./models/Message');
const passport = require('passport');
const logger = require('morgan');
const userModule = require('./modules/user/index');
const emailModule = require('./modules/mail/index')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./modules/user/schemas/User');
const { Room } = require('./modules/room/schemas/Room');
const { ResumeToken } = require('mongodb');
const { Body } = require('node-fetch');

const PORT = 3000;
// mongoose.connect(keys.mongoURI);

const app = express();
const server = http.createServer(app);
var clients = {};

async function initDatabase() {
  const db = "mongodb+srv://valentin:J2uaZNgIM02cRrGo@cluster0.3bakk.mongodb.net/test"
  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };

  return mongoose.connect(db, options)
    .then(() => {
      console.log("Mongoose connected !")
      var weu = mongoose.connection;
      weu.on('error', console.error.bind(console, 'connection error:'));
      weu.once('open', function () {
        console.log("OK")
      });
    })
}

async function BDDUpdateOneUser(querry, args) {
  await User.updateOne(querry, args);
}

async function BDDUpdateOneRoom(querry, args) {
  await Room.updateOne(querry, args);
}

const io = socketIO(server);
io.on('connection', socket => {
  console.log('client connected on websocket');
  socket.on("registerSocket", (body) => {
    console.log("Adding client: " + body.deviceId + " | " + socket.id)
    clients[body.deviceId] = socket.id;
  });





  socket.on("disconnect", (reason) => {
    console.log("Client disconnected: " + reason);
    const clientId = Object.keys(clients).find(key => clients[key] === socket.socketId);
    if (clientId !== null) {
      delete clients[clientId];
      console.log("Client disconnected successfully");
    }
  });





  socket.on("register", (body) => {
    const { username, email, password } = body;
    console.log("Client registers");

    User.findOne({ email: email }, function (err, result) {
      if (err)
        socket.emit('register', { status: "error", message: "Error while registering account." });
      if (result) {
        socket.emit('register', { status: "error", message: "Email already in use." });
      } else {
        // userEmail = true;
        User.findOne({ username: username }, function (err, result) {
          if (err)
            socket.emit('register', { status: "error", message: "Error while registering account." });
          if (result) {
            socket.emit('register', { status: "error", message: "Username already in use." });
          } else {
            const newUser = new User({
              email: email,
              password: password,
              username: username
            })
            newUser.save()
            emailModule.send({
              recipient: email,
              subject: 'Account confirmation',
              content: 'Welcome on our application!\n\n'
                + 'Please confirm your account by clicking the link below:\n'
                + `http://localhost:3000/confirm?email=${email}`
            })
              .then(info => ["email de confirmation envoy??"])
              .catch(error => error)
            socket.emit('register', { status: "ok", message: "Account created" });
          }
        })
      }
    })
  });





  socket.on("login", (body) => {
    const { email, password } = body;
    console.log("Client logins");
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('login', { status: "error", message: "Error while login." });
      if (result) {
        console.log("ver: " + result.verified)
        if (!result.verified)
          socket.emit('login', { status: "error", message: "Account not verified." });
        else if (result.password === password)
          socket.emit('login', { status: "ok", message: result.username });
        else
          socket.emit('login', { status: "error", message: "Credentials do not match." });
      } else {
        socket.emit('login', { status: "error", message: "No account with this email address." });
      }
    })
  })





  socket.on("recover", (body) => {
    const { email } = body;
    console.log("Client recovers");
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('recover', { status: "error", message: "Error while recovering account." });
      if (result) {
        emailModule.send({
          recipient: email,
          subject: 'Password reinitialisation',
          content: 'You are receiving thi email because you (or someone else) asked a password reinitialisation for your account.\n\n'
            + 'If you want to reset your password please click the link below\n\t\t'
            + `http://localhost:3000/reseting?deviceId=${body.deviceId}`
        })
          .then(info => ["email de recuperation envoy??"])
          .catch(error => error)
        socket.emit('recover', { status: "ok", message: "Please check your mails" });
      } else {
        socket.emit('recover', { status: "error", message: "No account with this email address." });
      }
    })
  })





  socket.on("reset", (body) => {
    console.log("Client resets");
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('reset', { status: "error", message: "Error while reseting account password." });
      if (result) {
        BDDUpdateOneUser({ email: body.email }, { password: body.password });
        socket.emit('reset', { status: "ok", message: "Password reset succesfuly" });
      } else {
        socket.emit('reset', { status: "error", message: "No account with this email address." });
      }
    })
  })





  socket.on("message", (body) => {
    console.log("Client sends a message in: " + body.roomName);
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('message', { status: "error", message: "Error sending the message." });
      if (result) {
        //console.log(result.messages);
        User.findOne({ email: body.email }, function (err, res) {
          if (err)
            socket.emit('messages', { status: "error", message: "Error while identifying user who asks messages." });
          if (res) {
            username = res.username.toString();
            var message = { "date": body.date, "user": username, "message": body.message };
            const messages = result.messages;
            //console.log("messages of " + body.roomName + " : " + body.message);
            messages.push(message);
            //console.log("messages of " + body.roomName + " : " + body.message);
            BDDUpdateOneRoom({ name: body.roomName }, { messages: messages });
            socket.emit('message', { status: "ok", message: "Message sent." });
          }
          else
            socket.emit('messages', { status: "error", message: "No user with this email." });
        })
      } else {
        socket.emit('message', { status: "error", message: "No Room :c" });
      }
    })
  })




  socket.on("addMember", (body) => {
    console.log("Client add member in: " + body.roomName);
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('message', { status: "error", message: "Error sending the message." });
      if (result) {
        //console.log(body.members);
        BDDUpdateOneRoom({ name: body.roomName }, { members: body.members });
        body.members.forEach(element => {
          User.findOne({ username: element }, function (err, res) {
            if (res) {
              res.rooms.push({ roomName: body.roomName, archived: { status: false } });
              BDDUpdateOneUser({ username: element }, { rooms: res.rooms });
            }
          })
        });
      } else
        socket.emit('message', { status: "error", message: "Error sending the message." });
    })
  })





  socket.on("addContacts", (body) => {
    console.log("Client add member in: " + body.contact);
    User.findOne({ username: body.contact }, function (err, result) {
      if (err)
        socket.emit('addContacts', { status: "error", message: "Error this user doesn't exist." });
      if (result) {
        User.findOne({ email: body.email }, function (err, res) {
          if (res) {
            username = res.username.toString();
            let contacts1 = result.friends;
            let contacts2 = res.friends;
            if (!contacts1.includes(res.username))
              contacts1.push(res.username);
            if (!contacts2.includes(result.username))
              contacts2.push(result.username);
            BDDUpdateOneUser({ username: result.username }, { friends: contacts1 });
            BDDUpdateOneUser({ username: res.username }, { friends: contacts2 });
            // if (res.pending != '')
            //   BDDUpdateOneUser({ username: body.contact }, { pending: (username + "," + res.pending) });
            // else
            //   BDDUpdateOneUser({ username: body.contact }, { pending: username });
          }
        })
      }
      else
        socket.emit('addContacts', { status: "error", message: "Error this user doesn't exist." });
    })
  })





  socket.on("messages", (body) => {
    let username = '';
    let messages = [{}];
    //console.log("Client " + body.email + " asks for messages of room: " + body.roomName);
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('messages', { status: "error", message: "Error while identifying user who asks messages." });
      if (result) {
        username = result.username;
        messages = result["rooms"];
        Room.findOne({ name: body.roomName }, function (err, res) {
          if (err)
            socket.emit('messages', { status: "error", message: "Error searching for the room." });
          if (res) {
            if (res.members.includes(username))
              socket.emit('messages', { status: "ok", message: res.messages });
            else {
              for (const [key, value] of Object.entries(messages)) {
                if (value["roomName"] == res.name) {
                  messages = messages[key]["archived"]["message"];
                  break;
                }
              }
              socket.emit('messages', { status: "ok", message: "Not member", content: messages });
            }
          } else
            socket.emit('messages', { status: "error", message: "No Room to get messages from." });
        })
      } else
        socket.emit('messages', { status: "error", message: "No user with this email." });
    })
  })





  socket.on("getOwner", (body) => {
    //console.log("Client asks for room owner");
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('getOwner', { status: "error", message: "Error searching for the room." });
      if (result) {
        //console.log(result.name);
        //console.log(result.owner);
        socket.emit('getOwner', { status: "ok", message: result.owner });
      } else
        socket.emit('getOwner', { status: "error", message: "Error searching for the room. No room found" });
    })
  })





  socket.on("getContacts", (body) => {
    //console.log("Client " + body.email + " asks for his friends: " + body.friends);
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('getContacts', { status: "error", message: "Error while identifying user who asks friends." });
      if (result)
        socket.emit('getContacts', { status: "ok", message: result.friends });
      else
        socket.emit('getContacts', { status: "error", message: "No user with this email." });
    })
  });




  socket.on("createRoom", (body) => {
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('createRoom', { status: "error", message: "Error when attemps to create a new room." });
      if (result) {
        Room.findOne({ name: body.roomName }, function (err, redwart) {
          if (!err && !redwart) {
            result.rooms.push({ roomName: body.roomName, archived: { status: false } })
            body.members.push(result.username)
            body.members.forEach(element => {
              User.findOne({ username: element }, function (err, res) {
                if (res) {
                  res.rooms.push({ roomName: body.roomName, archived: { status: false } });
                  BDDUpdateOneUser({ username: element }, { rooms: res.rooms });
                }
              })
            });
            const newRoom = new Room({
              name: body.roomName,
              members: body.members,
              owner: result.username,
              message: []
            })
            newRoom.save()
            //create room on room
          } else
            console.log("already exist");
        });
      } else
        socket.emit('createRoom', { status: "error", message: "Error this user doesn't exist." });
    })
  })





  socket.on("getRooms", (body) => {
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('getRooms', { status: "error", message: "Error while identifying user who asks friends." });
      if (result) {
        let rooms = [];
        for (const [key, value] of Object.entries(result.rooms)) {
          //console.log(result.rooms[key]["roomName"]);
          rooms.push(result.rooms[key]["roomName"]);
        }
        //console.log(rooms);
        socket.emit('getRooms', { status: "ok", message: rooms });
      } else
        socket.emit('getRooms', { status: "error", message: "No user with this email." });
    })
  });




  socket.on("getPendings", (body) => {
    //console.log("Client " + body.email + " asks for his friends: " + body.friends);
    User.findOne({ email: body.pending }, function (err, result) {
      if (err)
        socket.emit('getPendings', { status: "error", message: "Error while identifying user who asks friends." });
      if (result)
        socket.emit('getPendings', { status: "ok", message: result.friends });
      else
        socket.emit('getPendings', { status: "error", message: "No user with this email." });
    })
  });




  socket.on("setOwner", (body) => {
    console.log("Room owner changed to " + body.userName + " for room: " + body.roomName);
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('setOwner', { status: "error", message: "Error searching for the room." });
      if (result) {
        //console.log(result.name);
        BDDUpdateOneRoom({ name: body.roomName }, { owner: body.userName });
        //console.log(result.owner);
        socket.emit('setOwner', { status: "ok", message: "Owner changed" });
      } else
        socket.emit('setOwner', { status: "error", message: "Error searching for the room. No room found" });
    })
  })





  socket.on("getMembers", (body) => {
    let username = '';
    //console.log("Client " + body.email + " asks for members of room: " + body.roomName);
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('getMembers', { status: "error", message: "Error while identifying user who asks messages." });
      if (result)
        username = result.username.toString();
      else
        socket.emit('getMembers', { status: "error", message: "No user with this email." });
    })
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('getMembers', { status: "error", message: "Error searching for the room." });
      if (result)
        socket.emit('getMembers', { status: "ok", message: result.members });
      else
        socket.emit('getMembers', { status: "error", message: "No Room to get messages from." });
    })
  })





  socket.on("iQuit", (body) => {
    console.log("Client " + body.email + " asks to leave the room room: " + body.roomName + ", goodbye :c");
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('iQuit', { status: "error", message: "Error while identifying user who asks messages." });
      if (result) {
        let rooms = result.rooms;
        for (const [key, value] of Object.entries(rooms)) {
          if (value["roomName"] == body.roomName)
            delete rooms[key]
        }
        BDDUpdateOneUser({ email: body.email }, { rooms: rooms.filter(element => element !== undefined) });
      } else
        socket.emit('iQuit', { status: "error", message: "No user with this email." });
    })
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('iQuit', { status: "error", message: "Error searching for the room." });
      if (result) {
        let newMembers = result.members;
        newMembers.splice(newMembers.indexOf(body.username), 1)
        BDDUpdateOneRoom({ name: body.roomName }, { members: newMembers });
        BDDUpdateOneRoom({ name: body.roomName }, { owner: newMembers[0] });
        socket.emit('iQuit', { status: "ok", message: "Bye Bye" });
      } else
        socket.emit('iQuit', { status: "error", message: "No Room to get messages from." });
    })
  })





  socket.on("archive", (body) => {
    let messages = [{}];
    console.log("Client " + body.email + " asks to leave the room room: " + body.roomName + ", goodbye :c");
    Room.findOne({ name: body.roomName }, function (err, result) {
      if (err)
        socket.emit('archive', { status: "error", message: "Error searching for the room." });
      if (result) {
        let newMembers = result.members;
        newMembers.splice(newMembers.indexOf(body.username), 1)
        BDDUpdateOneRoom({ name: body.roomName }, { members: newMembers });
        BDDUpdateOneRoom({ name: body.roomName }, { owner: newMembers[0] });
        messages = result.messages;
      } else
        socket.emit('archive', { status: "error", message: "No Room to get messages from." });
    })
    User.findOne({ email: body.email }, function (err, result) {
      if (err)
        socket.emit('archive', { status: "error", message: "Error while identifying user who asks messages." });
      if (result) {
        let rooms = result.rooms;
        for (const [key, value] of Object.entries(rooms)) {
          if (value["roomName"] == body.roomName) {
            rooms[key]["archived"]["status"] = true;
            rooms[key]["archived"]["message"] = messages;
          }
        }
        BDDUpdateOneUser({ email: body.email }, { rooms: rooms.filter(element => element !== undefined) });
        socket.emit('archive', { status: "ok", message: "Bye Bye" });
      } else
        socket.emit('archive', { status: "error", message: "No user with this email." });
    })
  })
});


app.get('/reseting', function (req, res) {
  const deviceId = req.query.deviceId;
  const socketId = clients[deviceId];
  if (socketId !== null)
    io.to(socketId).emit('reseting', { status: "ok", message: "" })
});

app.get('/confirm', function (req, res) {
  const email = req.query.email;
  if (email !== null)
    User.findOne({ email: email }, function (err, result) {
      if (result) {
        BDDUpdateOneUser({ email: email }, { verified: true });
      }
    })
});


function initServer() {
  // app.use('/users/', userRoutes)
  // app.use('/markers/', markerRoutes)
  // app.use('/markersRefuge/', refugeRoutes)
  // app.use('/mail/', mailRoutes);
  // app.use('/', require('./routes/index'));

  // app.use('/users', require('./routes/users'));
  // app.use(express.static(__dirname + '/public'));
  // app.use('/mail', require('./routes/mail'));
  server.listen(PORT, () => {
    console.log('server started and listening on port ' + PORT);
  });
}

function initExpress() {
  // view engine setup
  app.set("view engine", "jade")

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser())
  app.use(passport.initialize());
}

function run() {
  initDatabase()
    .then(() => {
      console.log('database successfully connected');
      initExpress();
      initServer();
    })
    .catch(err => console.error(err))
}

run();