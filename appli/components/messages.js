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
      selectContacts: [],
      rooms: [],
      roomName: ""
    }
    this.getRoomlist = this.getRoomlist.bind(this);
    this.moveToContacts = this.moveToContacts.bind(this);
    this.showPopupContactList = this.showPopupContactList.bind(this);
    this.showPopupCreateRoom = this.showPopupCreateRoom.bind(this);
    this.hidePopupContactList = this.hidePopupContactList.bind(this);
    this.hidePopupCreateRoom = this.hidePopupCreateRoom.bind(this);
    this.removeSelectedContactList = this.removeSelectedContactList.bind(this);
    this.addSelectedContactList = this.addSelectedContactList.bind(this);
    this.renderItemContactList = this.renderItemContactList.bind(this);
    this.addContacts = this.addContacts.bind(this);
  }

  componentWillUnmount() {
    
  }

  componentDidMount() {
    GLOBALS.SOCKET.on('getRooms', data => {
      console.log("data: " + data.status + " / " + data.message);
      if (data.status === "ok") {
        this.state.rooms = data.message.toString().split(",");
      }
    });
    this.refresh();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  moveToContacts() {
    this.props.navigation.navigate("Contact");
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
          GLOBALS.SOCKET.emit('getRooms', { email: GLOBALS.EMAIL });
    })
  };


  removeSelectedContactList(item) {
    if (this.state.selectContacts.includes(item)) {
      this.state.selectContacts.splice(this.state.selectContacts.indexOf(item), 1);
      this.setState({ state: this.state });
    }
  }

  addSelectedContactList(item) {
    if (!this.state.selectContacts.includes(item)) {
      this.state.selectContacts.push(item);
      this.setState({ state: this.state });
    }
  }

  addContacts() {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        console.log("set member to room on server :" + this.state.selectContacts);
        if (this.state.selectContacts[0] != "") {
          GLOBALS.SOCKET.emit('createRoom', { email: GLOBALS.EMAIL , roomName: this.state.roomName, members: this.state.selectContacts});
          this.state.selectContacts = [];
          this.setState({ popupContactList: false });
          GLOBALS.SOCKET.emit('getRooms', { email: GLOBALS.EMAIL });
          this.hidePopupCreateRoom();
        }
      }
    });
  };

  renderItemContactList(item) {
    const backgroundColor = this.state.selectContacts.includes(item) ? "#5ADE7EF0" : "#5ADED8F0";
    const color = this.state.selectContacts.includes(item) ? '#DEB45A' : 'black';

    if (this.state.selectContacts.includes(item)) {
      return (
        <TouchableOpacity onPress={() => this.removeSelectedContactList(item)} style={{ width: "100%", height: 50, padding: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 30, borderRadius: 30, backgroundColor }}>
          <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color }}>{item}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.addSelectedContactList(item)} style={{ width: "100%", height: 50, padding: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 30, borderRadius: 30, backgroundColor }}>
          <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color }}>{item}</Text>
        </TouchableOpacity>
      );
    }
  }


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
          <TouchableOpacity onPress={this.moveToContacts} style={{ width: 60 }}>
            <View style={{ borderRadius: 5, width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ height: "90%", width: "90%", alignSelf: "center" }}
                source={require('../assets/icon-contacts.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.moveToRoom("room1")} style={{ width: 60 }}>
            <View style={{ borderRadius: 5, width: "100%", height: "100%", alignItems: "center", backgroundColor: "#8D8D8D" }}>
              <Image
                style={{ height: "90%", width: "90%", alignSelf: "center" }}
                source={require('../assets/logo.png')}
              />
            </View>
          </TouchableOpacity>
          <Text style={{ paddingLeft: 20, fontSize: 50 }}>Room</Text>
        </View>
        <View style={{ width: "100%", height: "90%", padding: 20, backgroundColor: "#4535F260", }}>
          {this.state.popupCreateRoom && (
            <View style={{ position: 'absolute', left: 10, right: 10, top: 10, backgroundColor: "white", zIndex: 90, padding: 10, }}>
              <Text style={{ fontSize: 25 }}>create a room</Text>
              <TouchableOpacity onPress={this.hidePopupCreateRoom} style={{ position: 'absolute', right: 10 }}>
                <View style={blockacceuil.logoConnection}>
                  <Text style={blockacceuil.textLogoConnection3}>x</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: "100%", }}>
                <TextInput
                  placeholder="nom de la room"
                  placeholderTextColor="black"
                  style={popup.textinput}
                  onChangeText={text => this.setState({ roomName: text })} />
              </View>
              <TouchableOpacity onPress={() => { this.state.roomName != "" ? this.showPopupContactList() : null }} style={{ borderRadius: 5, padding: 5, marginTop: 10, alignSelf: 'center', backgroundColor: "#60B34560" }}>
                <View>
                  <Text>Choose contacts to invite</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.popupContactList && (
            <View style={popup.popup}>
              <View style={popup.popup2}>
                <View style={containers.container}>
                  <View style={{ width: "100%", alignItems: "center", backgroundColor: "black" }}>
                    <TouchableOpacity onPress={this.hidePopupContactList} style={blockacceuil.blockRecup2}>
                      <View style={blockacceuil.logoConnection}>
                        <Text style={blockacceuil.textLogoConnection3}>x</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "100%", height: "70%", padding: 20, backgroundColor: "red", shadowColor: "#303838", shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, shadowOpacity: 0.45 }}>
                    <FlatList
                      data={GLOBALS.CONTACTS}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => this.renderItemContactList(item)}
                    />
                  </View>
                  <View>
                    <TouchableOpacity onPress={this.addContacts} style={{ width: "100%", height: 50, padding: 5, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: 30, backgroundColor: "grey", borderRadius: 30 }}>
                      <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color: "black" }}>Create</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          <FlatList
            data={this.state.rooms}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={({item}) => {
              return (<Text style={{ flex: 1, textAlign: "center", fontSize: 25, color: "black" }}>No Room</Text>);
            }}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => this.moveToRoom(item)} style={{borderRadius: 10, backgroundColor: "#6555F260",margin: 5, padding: 5,}}>
                <View>
                  <Text style={{ flex: 1, textAlign: "center", fontSize: 25, color: "black" }}>{item}</Text>
                </View>
              </TouchableOpacity>
            }
          />
          <TouchableOpacity onPress={this.showPopupCreateRoom} style={{ position: 'absolute', right: 20, bottom: 20, width: 60, }}>
            <View>
              <Image
                style={{ width: 60, height: 60, }}
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
