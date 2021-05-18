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
      popupContactList: false,
      rooms: []
    }
    this.getRoomlist = this.getRoomlist.bind(this);
    this.moveToContacts = this.moveToContacts.bind(this);
    this.showPopupContactList = this.showPopupContactList.bind(this);
    this.showPopupCreateRoom = this.showPopupCreateRoom.bind(this);
    this.hidePopupContactList = this.hidePopupContactList.bind(this);
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

  moveToContacts() {
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

  showPopupContactList() {
    this.setState({ popupContactList: true });
  };

  hidePopupContactList() {
    this.setState({ popupContactList: false });
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
        <View style={{ flex: 1, flexDirection: "row", width: "100%", padding: 5 }}>
          <TouchableOpacity onPress={this.moveToContacts} style={{width: 60 }}>
            <View style={{ borderRadius: 5, width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{height: "90%", width: "90%", alignSelf: "center" }}
                source={require('../assets/icon-contacts.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={ () => this.moveToRoom("room1")} style={{width: 60 }}>
            <View style={{ borderRadius: 5, width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{height: "90%", width: "90%", alignSelf: "center" }}
                source={require('../assets/logo.png')}
              />
            </View>
          </TouchableOpacity>

          {this.state.popupCreateRoom && (
                <View style={{position: 'absolute', left: 10, right: 10, top: 100, backgroundColor: "white", zIndex: 90, padding: 10,}}>
                  <Text style={{ fontSize: 25 }}>create a room</Text>
                  <TouchableOpacity onPress={this.hidePopupCreateRoom} style={{position: 'absolute', right: 10}}>
                    <View style={blockacceuil.logoConnection}>
                      <Text style={blockacceuil.textLogoConnection3}>x</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ width: "100%",}}>
                    <TextInput
                      placeholder="nom de la room"
                      placeholderTextColor="black"
                      style={popup.textinput}
                      onChangeText={text => this.setState({ emailDeRecup: text })} />
                  </View>
                  <TouchableOpacity onPress={this.showPopupCreateRoom} style={{borderRadius: 5, padding: 5, marginTop: 10, alignSelf: 'center', backgroundColor: "#60B34560"}}>
                    <View>
                      <Text>Choose contacts to invite</Text>
                    </View>
                  </TouchableOpacity>
                </View>
          )}

        </View>

        <View style={{ width: "100%", height: "90%", padding: 20, backgroundColor: "#4535F260",}}>
          <FlatList
            data={this.state.contacts}
            keyExtractor={item => item}
            renderItem={({ item }) =>
              <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color: "black" }}>{item}</Text>
            }
          />
          <TouchableOpacity onPress={this.showPopupCreateRoom} style={{position: 'absolute', right: 20, bottom: 20, width: 60,}}>
            <View>
              <Image
                style={{width: 60,height: 60,}}
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
