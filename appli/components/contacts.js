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
      popupAddfriend: false,
      contacts: ['']
    }
    this.getContactlist = this.getContactlist.bind(this);
    this.moveToRecover = this.moveToRecover.bind(this);
    this.moveMessages = this.moveMessages.bind(this);
    this.showPopupAddFriend = this.showPopupAddFriend.bind(this);
    this.hidePopupAddFriend = this.hidePopupAddFriend.bind(this);
    this.closePopupAddFriend = this.closePopupAddFriend.bind(this);
  }

  componentDidMount() {
    GLOBALS.SOCKET.on('getContacts', data => {
      console.log("data: " + data.status + " / " + data.message);
      if (data.status === "ok") {
        console.log(data.message.toString().split(","));
        this.state.contacts = data.message.toString().split(",");
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

  moveMessages() {
    this.props.navigation.navigate("Messages");
  };

  refresh() {
    this.getContactlist();
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
        if (this.state.contacts[0] === "") {
          GLOBALS.SOCKET.emit('getContacts', { email: GLOBALS.EMAIL });
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

  closePopupAddFriend() {
    NetInfo.fetch().then(state => {

    });
  };

  render() {
    return (

      <View style={containers.container}>
        <View style={{ flex: 1, flexDirection: "row", width: "100%", height: "15%", padding: 30 }}>
          <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%" }}>
            <View style={{ borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center" }}
                source={require('../assets/icon-contacts.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%" }} onPress={this.moveMessages}>
            <View style={{ borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center" }}
                source={require('../assets/logo.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.showPopupAddFriend} style={{ flexDirection: "row", backgroundColor: "white", height: "100%", width: "17%" }}>
            <View style={{ borderRadius: 5, borderColor: 'black', width: "100%", height: "100%", alignItems: "center", backgroundColor: "#CDCDCD" }}>
              <Image
                style={{ marginTop: "17%", marginBottom: "17%", height: "60%", width: "70%", alignSelf: "center" }}
                source={require('../assets/icon-add-contact.png')}
              />
            </View>
          </TouchableOpacity>

          {this.state.popupAddfriend && (
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
                    <TouchableOpacity onPress={this.closePopupAddFriend} style={blockacceuil.blockConnection2}>
                      <View style={blockacceuil.logoConnection}>
                        <Text style={blockacceuil.textLogoConnection2}>?</Text>
                      </View>
                      <Text style={blockacceuil.textConnection}>Add friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.hidePopupAddFriend} style={blockacceuil.blockRecup2}>
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
        </View>
      </View>

    )
  }
}

export default App;
