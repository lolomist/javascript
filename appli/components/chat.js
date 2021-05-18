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
      members: [''],
      message: '',
      messages: [{}],
      popupOwnerSettings: false
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.getRoomMessages = this.getRoomMessages.bind(this);
    this.showOwnerSettingsPopup = this.showOwnerSettingsPopup.bind(this);
    this.hideOwnerSettingsPopup = this.hideOwnerSettingsPopup.bind(this);
    this.moveToRecover = this.moveToRecover.bind(this);
  }

  componentDidMount() {
    this.state.roomName = this.props.navigation.getParam('room', 'room1');
    GLOBALS.SOCKET.on('messages', data => {
        //console.log("data: " + data.status + " / " + data.message);
        if (data.status === "ok") {
            //console.log(data.message.toString().split(","));
            //this.state.messages = data.message[i].message.toString();
            this.state.messages = data.message;
        } else {
        // récup de l'archive ici: this.state.messages = les_messages_archivés
          ;
        }
    });
    GLOBALS.SOCKET.on('getMembers', data => {
      console.log("data: " + data.status + " / " + data.message);
      if (data.status === "ok") {
          console.log(data.message.toString().split(","));
          this.state.members = data.message.toString().split(",");
      } else {
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
    this.setState({ state: this.state });
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
                GLOBALS.SOCKET.emit('message', { message: this.state.message, roomName: this.state.roomName , email: GLOBALS.EMAIL, date: Date.now()});
                this.state.message = "";
            }
        }
    });
  };

  showOwnerSettingsPopup() {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        console.log(this.state.members);
        if (this.state.members[0] === "") {
          GLOBALS.SOCKET.emit('getMembers', { email: GLOBALS.EMAIL, roomName: this.state.roomName });
        }
      }
    });
    this.setState({ popupOwnerSettings: true });
  };
  hideOwnerSettingsPopup() {
    this.setState({ popupOwnerSettings: false });
  };

  moveToRecover() {
  };

  render() {
    return (
      <View style={containers.container}>
        <View style={{flex: 1, flexDirection: "row", width: "100%", height: "15%", padding: 30}}>
            <TouchableOpacity onPress={this.showOwnerSettingsPopup} style={{flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%"}}>
                <View style={{borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD"}}>
                    <Image
                        style={{marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center"}}
                        source={require('../assets/icon-add-contact.png')}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.showOwnerSettingsPopup} style={{flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%"}}>
                <View style={{borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD"}}>
                    <Image
                        style={{marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center"}}
                        source={require('../assets/icon-owner-settings.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>

        <View style={{width: "100%", height: "70%", padding: 20, backgroundColor: "white", shadowColor: "#303838", shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.45}}>
            <FlatList 
                data={this.state.messages}
                keyExtractor={(item, index) => index.toString()}
                inverted
                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                renderItem={({item}) =>
                  <View style={{padding:5,marginBottom: 5,backgroundColor: "#D5D8DC44", shadowColor: "#303838", shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.4}}><Text style={{ fontSize: 20, color: "black" }}>{item.user} the {new Date(parseInt(item.date)).toDateString()}</Text>
                  <Text style={{ fontSize: 20, color: "black" }}>- {item.message}</Text></View>
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
                        style={{marginTop: "13%", marginBottom: "17%", height: "60%", width: "55%", alignSelf: "center"}}
                        source={require('../assets/icon-email-send.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>

        {this.state.popupOwnerSettings && (
          <View style={popup.popup}>
            <View style={popup.popup2}>
              <View style={containers.container}>
                <View style={{width:"100%",alignItems:"center", backgroundColor: "black"}}>
                  <TouchableOpacity onPress={this.hideOwnerSettingsPopup} style={blockacceuil.blockRecup2}>
                    <View style={blockacceuil.logoConnection}>
                      <Text style={blockacceuil.textLogoConnection3}>x</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width: "100%", height: "70%", padding: 20, backgroundColor: "red", shadowColor: "#303838", shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.45}}>
                  <FlatList 
                    data={this.state.members}
                    keyExtractor={item => item}
                    renderItem={({ item }) =>
                      <TouchableOpacity onPress={this.hideOwnerSettingsPopup} style={{width: "100%", height: 50, padding: 5, flexDirection: "row", justifyContent:"flex-start", alignItems: "center", marginTop:30, backgroundColor: "grey", borderRadius: 30}}>
                        <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color: "black" }}>{item}</Text>
                      </TouchableOpacity>
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

    )
  }
}

export default App;
