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
      popupCreateRoom: false,
      rooms: []
    }
    this.getRoomlist = this.getRoomlist.bind(this);
    this.moveToMessage = this.moveToMessage.bind(this);
    this.showPopupCreateRoom = this.showPopupCreateRoom.bind(this);
    this.hidePopupCreateRoom = this.hidePopupCreateRoom.bind(this);
  }

  componentDidMount() {
    GLOBALS.SOCKET.on('getRooms', data => {
      console.log("data: " + data.status + " / " + data.message);
      if (data.status === "ok") {
        // is ok
      } else {
        // is not ok
        ;
      }
    });
    this.refresh();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  moveToMessage() {
    this.props.navigation.navigate("contacts");
  };

  moveToRoom(selectedRoom) {
    this.props.navigation.navigate("Chat", { room: selectedRoom });
  };

  refresh() {
    this.getRoomlist();
    this.intervalID = setTimeout(this.refresh.bind(this), 1000);
    this.setState({ state: this.state });
  }

  getRoomlist() {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else
        if (!this.state.rooms[0])
          ;//GLOBALS.SOCKET.emit('getRoomList', { email: GLOBALS.EMAIL });
    })
  };

  showPopupCreateRoom() {
    this.setState({ popupCreateRoom: true });
  };

  hidePopupCreateRoom() {
    this.setState({ popupCreateRoom: false });
  };

  render() {
    return (

      <View style={containers.container}>
        <View style={{ flex: 1, flexDirection: "row", width: "100%", height: "15%", padding: 30 }}>
          <TouchableOpacity onPress={this.moveToMessage} style={{ flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%" }}>
            <View style={{ borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center" }}
                source={require('../assets/icon-contacts.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={ () => this.moveToRoom("room1")} style={{ flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%" }}>
            <View style={{ borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center" }}
                source={require('../assets/logo.png')}
              />
            </View>
          </TouchableOpacity>

          {this.state.CreateRoom && (
            <View style={popup.popup}>
              <View style={popup.popup2}>
                <View style={containers.container}>
                  <Text style={{ fontSize: 25 }}>Veuillez renseigner votre nouvel ami.</Text>
                  <View style={{ width: "100%", top: "30%" }}>
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor="black"
                      style={popup.textinput}
                      onChangeText={text => this.setState({ emailDeRecup: text })} />
                  </View>

                  <View style={{ width: "100%", alignItems: "center", top: "50%" }}>
                    <TouchableOpacity onPress={this.hidePopupCreateRoom} style={blockacceuil.blockRecup2}>
                      <View style={blockacceuil.logoConnection}>
                        <Text style={blockacceuil.textLogoConnection3}>x</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

        </View>

        <View style={{ width: "100%", height: "70%", padding: 20, backgroundColor: "red", shadowColor: "#303838", shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.45 }}>
          <FlatList
            data={this.state.contacts}
            keyExtractor={item => item}
            renderItem={({ item }) =>
              <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color: "black" }}>{item}</Text>
            }
          />
          <TouchableOpacity onPress={this.showPopupCreateRoom} style={{ flexDirection: "row", position: 'absolute', right: 10, bottom: 10, backgroundColor: "white", height: "10%", width: "10%" }}>
            <View style={{ borderRadius: 5, borderColor: 'black', alignItems: "center",}}>
              <Image
                style={{alignSelf: "center"}}
                source={require('../assets/icon-add-contact.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

    )
  }
}

export default App;
