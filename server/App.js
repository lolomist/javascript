const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
//const keys = require('./config/keys');
//require('./models/Message');
const passport = require('passport');
const logger = require('morgan');
const userModule = require('./modules/user/index');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./modules/user/schemas/User');

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
    const { name, firstname, email, password } = body;

    if (!name || !firstname || !email || !password) {
      socket.emit( 'register', {status: "error", message: "Merci de remplir toutes les cases."} );
      return;
    }
    if (password.length < 6) {
      socket.emit( 'register', {status: "error", message: "Les mdp doivent faire 6 charactères minimum."} );
      return;
    }

    const user = {
        name,
        firstname,
        email,
        password
    }

    console.log("Client registers");
    console.log("1-User password: " + password)

    socket.emit( 'register', {status: "ok", message: userModule.register(user)} );
  });





  socket.on("login", (body) => {
    let user = null;
    console.log("Client logins");
    User.findOne({ email: body.email })
        .then(data => {
            if (data === null) {
              socket.emit( 'login', {status: "error", message: "Credentials do not match."} );
              return;
            }
            user = data;
            return (body.password === data.password)
        })
        .then(res => {
            if (res === false) {
              socket.emit( 'login', {status: "error", message: "Credentials do not match."} );
              return;
            }
            socket.emit( 'login', {status: "ok", message: user} );
        })
        .catch((err) => {
          socket.emit( 'login', {status: "error", message: "Credentials do not match."} );
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