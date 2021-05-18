import React from 'react';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Button } from 'react-native';
import {AsyncStorage} from "react-native"
import { containers, blockacceuil, popup } from '../components/styles'
import GLOBALS from "../components/globals.js";
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
      emailError: false,
      emailErrorMessage: '',
      passwordError: false,
      passwordErrorMessage: ''
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

  storeDataEmail = async () => {
    try {
      await AsyncStorage.setItem('Email', this.state.email)
    } catch (e) {
    }
  }

  storeDataPassword = async () => {
    try {
      await AsyncStorage.setItem('Password', this.state.password)
    } catch (e) {
    }
  }


  //Fonction pour la connection
  onLoginPressed() {
    // test de connection
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert("No connection detected, please check your connection");
      } else {
        this.state.emailError = false;
        this.state.passwordError = false;
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.setState({ state: this.state });
        
        if (!this.state.email) {
          alert("Please fill in all fields");
          this.state.emailError = true;
          this.state.emailErrorMessage = "This field is required";
          this.setState({ state: this.state });
          return ("Invalid email address");
        }
        if (!this.state.password) {
          alert("Please fill in all fields");
          this.state.passwordError = true;
          this.state.passwordErrorMessage = "This field is required";
          this.setState({ state: this.state });
          return ("Invalid password");
        }
        if (!re.test(this.state.email)) {
          alert("Please enter a valid email address");
          this.state.emailError = true;
          this.state.emailErrorMessage = "Enter a valid email address";
          this.setState({ state: this.state });
          return ("Invalid email address");
        }
        if (this.state.password.length < 6 || !/\d/.test(this.state.password)) {
          alert("Your password must contain at least 6 characters and at least 1 number");
          this.state.passwordError = true;
          this.state.passwordErrorMessage = "Enter a valid password";
          this.setState({ state: this.state });
          return ("Invalid password");
        }

        GLOBALS.SOCKET.emit('login', { email: this.state.email, password: this.state.password });
        GLOBALS.SOCKET.on('login', data => {
          console.log("data: " + data.status + " / " + data.message);
          if (data.status === "ok") {
            console.log("Connected!");
            this.storeDataEmail(this.state.email);
            this.storeDataPassword(this.state.password);
            console.log("Going to the chat");
            //this.props.navigation.navigate("Chat", { room: 'room1' });
            this.props.navigation.navigate("Contact");
          } else {
            if (data.message === "No account with this email address.") {
              alert("No account with this email address.")
              this.state.emailError = true;
              this.state.emailErrorMessage = "No account with this address.";
              this.setState({ state: this.state });
            } else if (data.message === "Credentials do not match.") {
              alert("Credentials do not match.")
              this.state.passwordError = true;
              this.state.passwordErrorMessage = "This password does not match this email address";
              this.setState({ state: this.state });
            } else if (data.message === "Account not verified.") {
              alert("Account not verified, a mail was sent to your mail address to confirm your account. Please click the link in this email to verify your account.")
            } else
              alert(data.message)
          }
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
    this.setState({ popupRecupMdp: false });
    this.props.navigation.navigate("Recover");
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

            {!this.state.emailError && (
              <TextInput
                placeholder="Email..."
                placeholderTextColor="black"
                style={popup.textinput}
                onChangeText={text => this.setState({ email: text })} />
            )}
            {this.state.emailError && (
              <TextInput
                placeholder="Email..."
                placeholderTextColor="black"
                style={popup.textinputRed}
                onChangeText={text => this.setState({ email: text })} /> 
            )}
            {this.state.emailError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.emailErrorMessage}</Text>
            )}

            
            {!this.state.passwordError && (
              <TextInput
                secureTextEntry
                placeholder="Password..."
                style={popup.textinput}
                placeholderTextColor="black"
                onChangeText={text => this.setState({ password: text })} />
            )}
            {this.state.passwordError && (
              <TextInput
                secureTextEntry
                placeholder="Password..."
                style={popup.textinputRed}
                placeholderTextColor="black"
                onChangeText={text => this.setState({ password: text })} />
            )}
            {this.state.passwordError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.passwordErrorMessage}</Text>
            )}
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
              <Text style={{ fontSize: 25}}>Do you want to recover your account?</Text>
              <View style={{width:"100%",alignItems:"center", top: "50%"}}>
                <TouchableOpacity onPress={this.closePopupRecupMdp} style={blockacceuil.blockConnection2}>
                  <View style={blockacceuil.logoConnection}>
                    <Text style={blockacceuil.textLogoConnection2}>?</Text>
                  </View>
                  <Text style={blockacceuil.textConnection}>Recover account</Text>
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
