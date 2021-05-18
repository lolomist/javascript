import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { containers, blockacceuil, popup } from '../components/styles'
import GLOBALS from "../components/globals.js";
import NetInfo from '@react-native-community/netinfo';
// import { RegisterEmmit, RegisterReceive } from './socket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      message: '',
      messages: ['']
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.getRoomMessages = this.getRoomMessages.bind(this);
    this.showPopupRecupMdp = this.showPopupRecupMdp.bind(this);
    this.hidePopupRecupMdp = this.hidePopupRecupMdp.bind(this);
    this.moveToRecover = this.moveToRecover.bind(this);
  }

  componentDidMount() {
    this.state.roomName = this.props.navigation.getParam('room', 'room1');
    GLOBALS.SOCKET.on('messages', data => {
        //console.log("data: " + data.status + " / " + data.message);
        if (data.status === "ok") {
            //console.log(data.message.toString().split(","));
            this.state.messages = data.message.toString().split(",");
        } else {
        // récup de l'archive ici: this.state.messages = les_messages_archivés
          ;
        }
    });
    this.refresh();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  //Navigation vers la page connection
  moveConnection() {
    this.props.navigation.navigate("Connection");
  };

  refresh() {
    this.getRoomMessages();
    this.intervalID = setTimeout(this.refresh.bind(this), 1000);
  }

  getRoomMessages() {
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert("No connection detected, please check your connection");
        } else { 
            GLOBALS.SOCKET.emit('messages', { email: GLOBALS.EMAIL, roomName: this.state.roomName });
        }
    });
  };

  //Fontion pour envoyer un message dans la room
  sendMessage() {
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert("No connection detected, please check your connection");
        } else {
            if (this.state.message !== null) {
                console.log(this.state.message + " | " + this.state.roomName)
                GLOBALS.SOCKET.emit('message', { message: this.state.message, roomName: this.state.roomName });
            }
        }
    });
  };

  showPopupRecupMdp() {
  };
  hidePopupRecupMdp() {
  };
  moveToRecover() {
  };

  render() {
    return (
      <View style={containers.container}>
        <View style={blockacceuil.block2}>
            <Text style={blockacceuil.textBlock}>Chat</Text>
        </View>

        <View style={blockacceuil.block3}>
            <FlatList 
                data={this.state.messages}
                keyExtractor={item => item}
                renderItem={({ item }) =>
                    <Text style={{ fontSize: 20, color: "black" }}>- {item}</Text>
                }
            />
        </View>

        <View style={{flex: 1, flexDirection: "row", marginTop: "10%", width: "100%", height: "15%", padding: 10, backgroundColor: "white", shadowColor: "#303838", shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.4}}>
            <TextInput
                label='Message'
                placeholderTextColor="black"
                placeholder="Enter your text"
                style={{borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderRightWidth: 1,
                    borderLeftWidth: 1,
                    borderRadius: 5,
                    borderColor: 'black',
                    width: "85%", 
                    height: "100%"}}
                value={this.state.message}
                onChangeText={message => this.setState({ message })}
            />
            <TouchableOpacity onPress={this.sendMessage} style={{flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%"}}>
                <View style={{borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD"}}>
                    <Image
                        style={{marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center"}}
                        source={require('../assets/white-arrow.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>
      </View>

    )
  }
}

export default App;
