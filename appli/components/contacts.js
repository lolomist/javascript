import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { containers, blockacceuil, popup } from '../components/styles'
import GLOBALS from "../components/globals.js";
import NetInfo from '@react-native-community/netinfo';
// import { RegisterEmmit, RegisterReceive } from './socket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupAddfriend: false,
      email: '',
      alertMessage: '',
      condition: true,
      emailError: false,
      maFriend: '',
      emailErrorMessage: '',
      pendingList: []
    }
    this.alertPresent = false;
    this.getContactlist = this.getContactlist.bind(this);
    this.getPendingList = this.getPendingList.bind(this);
    this.moveToRecover = this.moveToRecover.bind(this);
    this.moveToMessages = this.moveToMessages.bind(this);
    this.moveToContacts = this.moveToContacts.bind(this);
    this.showPopupAddFriend = this.showPopupAddFriend.bind(this);
    this.hidePopupAddFriend = this.hidePopupAddFriend.bind(this);
    this.sendFriendInvite = this.sendFriendInvite.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  componentDidMount() {
    //console.log("contact");
    GLOBALS.SOCKET.on('getContacts', data => {
      //console.log("data: " + data.status + " / " + data.message);
      if (data.status === "ok") {
        //console.log(data.message.toString().split(","));
        GLOBALS.CONTACTS = data.message.toString().split(",");
      } else {
        // récup de l'archive ici: this.state.messages = les_messages_archivés
        ;
      }
    });
    GLOBALS.SOCKET.on('addContacts', data => {
        alert(data.message);
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

  moveToMessages() {
    this.props.navigation.navigate("Messages");
  };

  moveToContacts() {
    this.props.navigation.navigate("Contact");
  };

  refresh() {
    this.getContactlist();
    this.getPendingList();
    this.intervalID = setTimeout(this.refresh.bind(this), 1000);
    this.setState({ state: this.state });
  }

  moveToRecover() {
  };


  getContactlist() {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        if (GLOBALS.CONTACTS[0] === "") {
          GLOBALS.SOCKET.emit('getContacts', { email: GLOBALS.EMAIL });
        }
      }
    })
  };

  getPendingList() {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        if (GLOBALS.CONTACTS[0] === "") {
          GLOBALS.SOCKET.emit('getPendings', { email: GLOBALS.EMAIL });
        }
      }
    })
  };

  showPopupAddFriend() {
    this.setState({ popupAddfriend: true });
  };

  hidePopupAddFriend() {
    this.setState({ popupAddfriend: false });
  };

  sendFriendInvite() {
    NetInfo.fetch().then(state => {
      console.log(this.state.maFriend);
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        console.log("Sending pending request to:" + this.state.maFriend);
        if (this.state.maFriend != "") {
          GLOBALS.SOCKET.emit('addContacts', { email: GLOBALS.EMAIL, contact: this.state.maFriend });
          this.setState({ popupAddfriend: false });
        }
      }
    });
  };


  render() {
    return (

      <View style={containers.container}>
        <View style={{ flex: 1, flexDirection: "row", width: "100%", padding: 5 }}>
          <TouchableOpacity onPress={this.moveToContacts} style={{ width: 60 }}>
            <View style={{ borderRadius: 5, width: "100%", height: "100%", alignItems: "center", backgroundColor: "#8D8D8D" }}>
              <Image
                style={{ height: "90%", width: "90%", alignSelf: "center" }}
                source={require('../assets/icon-contacts.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.moveToMessages("room1")} style={{ width: 60 }}>
            <View style={{ borderRadius: 5, width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ height: "90%", width: "90%", alignSelf: "center" }}
                source={require('../assets/logo.png')}
              />
            </View>
          </TouchableOpacity>
          <Text style={{ paddingLeft: 20, fontSize: 50 }}>Contacts</Text>

        </View>
        <View style={{ width: "100%", height: "90%", padding: 20, backgroundColor: "#4535F260", }}>

          {this.state.popupAddfriend && (
            <View style={{ position: 'absolute', left: 10, right: 10, top: 100, backgroundColor: "white", zIndex: 90, padding: 10, }}>
              <Text style={{ fontSize: 25 }}>Type who you want to add.</Text>
              <TouchableOpacity onPress={this.hidePopupAddFriend} style={{ position: 'absolute', right: 10 }}>
                <View style={blockacceuil.logoConnection}>
                  <Text style={blockacceuil.textLogoConnection3}>x</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: "100%", }}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="black"
                  style={popup.textinput}
                  onChangeText={text => this.setState({ maFriend: text })} />
              </View>
              <TouchableOpacity onPress={this.sendFriendInvite} style={{ borderRadius: 5, padding: 5, marginTop: 10, alignSelf: 'center', backgroundColor: "#60B34560" }}>
                <View>
                  <Text>Add</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}


          <FlatList
            data={GLOBALS.CONTACTS}
            keyExtractor={item => item}
            ListEmptyComponent={({item}) => {
              return (<Text style={{ flex: 1, textAlign: "center", fontSize: 30, color: "black" }}>No contact added yet</Text>);
            }}
            renderItem={({ item }) =>
              <Text style={{ flex: 1, textAlign: "center", fontSize: 30, color: "black" }}>{item}</Text>
            }
          />

          <TouchableOpacity onPress={this.showPopupAddFriend} style={{ position: 'absolute', right: 20, bottom: 20, width: 60, }}>
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
