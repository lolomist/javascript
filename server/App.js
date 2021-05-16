const http = require('http');
const express = require('express');
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
const { ResumeToken } = require('mongodb');

const PORT = 3000;
// mongoose.connect(keys.mongoURI);

const app = express();
const server = http.createServer(app);

async function initDatabase () {
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

const io = socketIO(server);
io.on('connection', socket => {
  console.log('client connected on websocket');





  socket.on("register", (body) => {
    const { username, email, password } = body;
    console.log("Client registers");

    User.findOne({ email: email }, function(err, result) {
      if (err)
        socket.emit( 'register', {status: "error", message: "Error while registering account."} );
      if (result) {
        socket.emit( 'register', {status: "error", message: "Email already in use."} );
      } else {
        // userEmail = true;
        User.findOne({ username: username }, function(err, result) {
          if (err)
            socket.emit( 'register', {status: "error", message: "Error while registering account."} );
          if (result) {
            socket.emit( 'register', {status: "error", message: "Username already in use."} );
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
                  + `http://localhost:3000/confirm`
            })
              .then(info => ["email de confirmation envoyé"])
              .catch(error => error)
            socket.emit( 'register', {status: "ok", message: "Account created"} );
          }
        })
      }
    })
  });





  socket.on("login", (body) => {
    const { email, password } = body;
    console.log("Client logins");
    User.findOne({ email: body.email }, function(err, result) {
        if (err)
          socket.emit( 'register', {status: "error", message: "Error while login."} );
        if (result) {
          if (result.password = password)
            socket.emit( 'login', {status: "ok", message: "Loging in"} );
          else
            socket.emit( 'register', {status: "error", message: "Credentials do not match."} );
        } else {
          socket.emit( 'recover', {status: "error", message: "No account with this email address."} );
        }
    })
  })





    socket.on("recover", (body) => {
      const { email } = body;
      console.log("Client recovers");
      User.findOne({ email: body.email }, function(err, result) {
          if (err)
            socket.emit( 'register', {status: "error", message: "Error while recovering account."} );
          if (result) {
            emailModule.send({
              recipient: email,
              subject: 'Password reinitialisation',
              content: 'You are receiving thi email because you (or someone else) asked a password reinitialisation for your account.\n\n'
                  + 'If you want to reset your password please click the link below\n\t\t'
                  + `http://localhost:3000/reseting`
            })
              .then(info => ["email de recuperation envoyé"])
              .catch(error => error)
            socket.emit( 'recover', {status: "ok", message: "Please check your mails"} );
          } else {
            socket.emit( 'recover', {status: "error", message: "No account with this email address."} );
          }  
      })
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