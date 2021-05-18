import socketIO from 'socket.io-client';
import GLOBALS from "./globals.js";
import {AsyncStorage} from "react-native";

const socket = socketIO('http://10.0.2.2:3000', {
  transports: ['websocket'], 
  jsonp: false 
});

getDataToken = async () => {
  try {
    const value = await AsyncStorage.getItem("token")
    if(value !== null) {
      GLOBALS.DEVICEID = value.toString();
      console.log("token exist: "+GLOBALS.DEVICEID.toString())
    } else {
      let token = Math.random().toString(36).substring(2);
      GLOBALS.DEVICEID = token;
      console.log("token created: "+GLOBALS.DEVICEID.toString())
      await AsyncStorage.setItem('token', token)
    }
    socket.emit('registerSocket', { deviceId: GLOBALS.DEVICEID.toString() })
  } catch(e) {
    // error reading value
  }
}

function Connect() {
    socket.connect();
    GLOBALS.SOCKET = socket;
    socket.on('connect', () => {
      getDataToken();
      GLOBALS.CONNECTED = true;
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