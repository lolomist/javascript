import React, { Component } from 'react'
import { 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
 } from 'react-native';
 import { containers, blockacceuil } from '../components/styles'
 import {AsyncStorage} from "react-native"
 import GLOBALS from "../components/globals.js";
 import NetInfo from '@react-native-community/netinfo';


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
        this.validateInscription = this.validateInscription.bind(this);
        this.moveConnection = this.moveConnection.bind(this);
        this.moveInscription = this.moveInscription.bind(this);
        this.moveSansCompte = this.moveSansCompte.bind(this);
    }

  handleChange(event) {
    this.setState({ value: event.target.value });
  } 

  componentDidMount() {
    this.refresh();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getDataEmail = async () => {
    try {
      const value = await AsyncStorage.getItem("Email")
      if(value !== null)
        GLOBALS.EMAIL = value.toString();
    } catch(e) {
      // error reading value
    }
  }
  getDataPassword = async () => {
    try {
      const value = await AsyncStorage.getItem("Password")
      if(value !== null)
        GLOBALS.PASS = value.toString();
    } catch(e) {
      // error reading value
    }
  }


  refresh() {
    this.getDataEmail();
    this.getDataPassword();
    this.moveSansCompte();
    this.intervalID = setTimeout(this.refresh.bind(this), 1000);
  }


  //Navigation vers la page connection
  moveSansCompte() {
    if (GLOBALS.CONNECTED) {
      if (GLOBALS.EMAIL && GLOBALS.PASS)
        GLOBALS.SOCKET.emit('login', { email: this.state.email, password: this.state.password });
        GLOBALS.SOCKET.on('login', data => {
          console.log("data: " + data.status + " / " + data.message);
          if (data.status === "ok") {
            console.log("Connected!");
            console.log("Going to the chat");
            this.props.navigation.navigate("Chat", { room: 'room1' });
          } else
            GLOBALS.CONNECTED = false;
        });
    }
  }

  moveConnection() {
    this.props.navigation.navigate("Connection");
  };

  moveInscription() {
    this.props.navigation.navigate("Inscription");
  };

  //Fontion pour enregistrer un compte dans la BDD
  validateInscription() {
    
  };

  render() {
    return (
        <View style={containers.containerPadding}>
          <StatusBar hidden={true} />
          <View style={blockacceuil.block}>
           <View style={blockacceuil.logo}>
                <Text style={blockacceuil.textLogo}>+</Text>
            </View>
            <Text style={blockacceuil.textBlock}>Créer son compte</Text>
            <Text style={blockacceuil.text2Block}>Un formulaire simple et rapide</Text>
            <TouchableOpacity onPress={this.moveInscription} style={blockacceuil.blockConnection}>
              <View style={blockacceuil.logoConnection}>
              <Text style={blockacceuil.textLogoConnection}>+</Text>
              </View>
              <Text style={blockacceuil.textConnection}>Créer un compte</Text>
           
              </TouchableOpacity>
          </View>
          <View style={{marginTop: "3%"}}/>
          <View style={blockacceuil.block}>
          <View style={blockacceuil.logo}>
                <Text style={blockacceuil.textLogo2}>¤</Text>
            </View>
            <Text style={blockacceuil.textBlock}>J'ai déjà un compte</Text>
            <Text style={blockacceuil.text2Block}>Accedez à l'application</Text>
            
            <TouchableOpacity onPress={this.moveConnection} style={blockacceuil.blockConnection}>
              <View style={blockacceuil.logoConnection}>
              <Text style={blockacceuil.textLogoConnection2}>¤</Text>
              </View>
              <Text style={blockacceuil.textConnection}>Me connecter</Text>
           
            </TouchableOpacity>
          </View>
      </View>
      
    )
  }
}

export default App;
