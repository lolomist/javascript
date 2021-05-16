import React from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Button } from 'react-native';
import {AsyncStorage} from "react-native"
import { containers, blockacceuil, popup } from '../components/styles'
import GLOBALS from "../components/globals.js";
import { JSEncrypt } from 'jsencrypt';
import NetInfo from '@react-native-community/netinfo';
const io = require('socket.io-client');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      popupRecupMdp: false,
      emailDeRecup: "",
    }
    this.onLoginPressed = this.onLoginPressed.bind(this);
    this.moveInscription = this.moveInscription.bind(this);
    this.showPopupRecupMdp = this.showPopupRecupMdp.bind(this);
    this.hidePopupRecupMdp = this.hidePopupRecupMdp.bind(this);
    this.closePopupRecupMdp = this.closePopupRecupMdp.bind(this);
  }

//Navigation vers l'inscription
  moveInscription() {
    this.props.navigation.goBack();
  };

  //Fonction pour la connection
  onLoginPressed() {
    // test de connection
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(this.state.email)) {
          alert("Please enter a valid email address");
          return ("Invalid email address");
        }

        GLOBALS.SOCKET.emit('login', { email: this.state.email, password: this.state.password });
        GLOBALS.SOCKET.on('login', data => {
          console.log("data: " + data.status + " / " + data.message);
          if (data.status === "ok") {
            console.log("Connected!");
            //this.props.navigation.navigate('Home')
          } else
            alert(data.message);
        });
      }
    });
  }

  //Fonction pour la récupération de mdp
  forgotPassword() {

  }

  //Différentes fonctions pour afficher et cacher des popup
  showPopupRecupMdp() {
    this.setState({ popupRecupMdp: true });
  };
  hidePopupRecupMdp() {
    this.setState({ popupRecupMdp: false });
  };
  closePopupRecupMdp() {

  };

  render() {
    return (
      <View style={containers.container}>
        <View style={blockacceuil.block2}>
           <View style={blockacceuil.logo}>
           <Text style={blockacceuil.textLogo2}>¤</Text>
            </View>
            <Text style={blockacceuil.textBlock}>J'ai déjà un compte</Text>
            <Text style={blockacceuil.text2Block}>Accedez à l'application</Text>
          </View>

          <View style={blockacceuil.block3}>
            <View style={blockacceuil.formulaire}>
            <Image
          style={{height: 70, width: 70, alignSelf: "center"}}
        source={require('../assets/user.png')}
      />
            <TextInput
          placeholder="Email..."
          placeholderTextColor="black"
          style={popup.textinput}
          onChangeText={text => this.setState({ email: text })} />

        <TextInput
          secureTextEntry
          placeholder="Mot de passe..."
          style={popup.textinput}
          placeholderTextColor="black"
          onChangeText={text => this.setState({ password: text })} />

        
              </View>
          </View>

      <View style={{flexDirection: "row", alignItems: "center", justifyContent:"center"}}>
          <TouchableOpacity onPress={this.onLoginPressed} style={blockacceuil.blockConnection2}>
              <View style={blockacceuil.logoConnection}>
              <Text style={blockacceuil.textLogoConnection2}>¤</Text>
              </View>
              <Text style={blockacceuil.textConnection}>Me connecter</Text>
           
              </TouchableOpacity>

              <TouchableOpacity onPress={this.showPopupRecupMdp} style={blockacceuil.blockRecup}>
              <View style={blockacceuil.logoConnection}>
              <Text style={blockacceuil.textLogoConnection2}>?</Text>
              </View>
           
              </TouchableOpacity>
         </View>

         {this.state.popupRecupMdp && (
        <View style={popup.popup}>
          <View style={popup.popup2}>
          <View style={containers.container}>
            <Text style={{ fontSize: 25}}>Veuillez renseigner votre addresse mail</Text>
           
           <View style={{width:"100%", top: "30%"}}>
            <TextInput
          placeholder="Email de récupération..."
          placeholderTextColor="black"
          style={popup.textinput}
          onChangeText={text => this.setState({ emailDeRecup: text })} />
          </View>

          <View style={{width:"100%",alignItems:"center", top: "50%"}}>
         <TouchableOpacity onPress={this.closePopupRecupMdp} style={blockacceuil.blockConnection2}>
              <View style={blockacceuil.logoConnection}>
              <Text style={blockacceuil.textLogoConnection2}>?</Text>
              </View>
              <Text style={blockacceuil.textConnection}>Récupération</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.hidePopupRecupMdp} style={blockacceuil.blockRecup2}>
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
      
    )
  }
}
