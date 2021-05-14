import socketIO from 'socket.io-client';
import GLOBALS from "./globals.js";

const socket = socketIO('http://10.0.2.2:3000', {
  transports: ['websocket'], 
  jsonp: false 
});

function Connect() {
    socket.connect();
    GLOBALS.SOCKET = socket;
    socket.on('connect', () => { 
      console.log('connected to socket server');
    });
}

// function RegisterEmmit(name, firstname, email, password) {
//     socket.emit('register', { name, firstname, email, password });
// }

// function RegisterReceive() {
//     socket.on('register', data => {
//         console.log("data: " + data.status + " / " + data.message);
//         if (data.status === "ok") {
//             alert("Inscription réussie !")
//             this.moveConnection();
//           }
//           else
//             alert(data.message)
//     });
// }

export { Connect };