import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { containers, blockacceuil, popup } from '../components/styles'
import GLOBALS from "../components/globals.js";
import { JSEncrypt } from 'jsencrypt';
import NetInfo from '@react-native-community/netinfo';
// import { RegisterEmmit, RegisterReceive } from './socket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      firstname: '',
      password: '',
      email: '',
      adress: '',
      zip: '',
      alertMessage: '',
      condition: true,
      public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAty7dthgTucfmmVimVQQ1\n1bqgrsk6aqUMVUL2vAylH4NFe6hHBn4rysBpUH8jfu6OG9DTvakrDAUt7YhJBkUp\nJ3N3MqGqviJ10AHGt/jvC/7PmqIcWz36hbaUf7knksZG3X5TsKgIR8kLIZzFHv/z\nhNV17/Y/yP1yaNPmnf6mnswc6eVJ9VGKjbLHXtWth6Z2j0drs5Jc4k3bxtBjoxZc\ngcjsqaeawyihaITQG2/zbmH691nuZq3kfGrOoESr7DhRdK4YzBLa3DdsGQWZapbu\nzhNsvSzCoZR1vaFOFNKjXgJN+MzGsQZTlkBEw7vyJQlw3SQVVHyPEVUWPggNd3Kg\n4QIDAQAB\n-----END PUBLIC KEY-----"
    }
    this.validateInscription = this.validateInscription.bind(this);
    this.moveConnection = this.moveConnection.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  //Navigation vers la page connection
  moveConnection() {
    this.props.navigation.navigate("Connection");
  };

  //Fontion pour enregistrer un compte dans la BDD
  validateInscription() {
    console.log(this.state.condition);
    if (this.state.condition == true) {

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

        // RegisterEmmit(this.state.name, this.state.firstname, this.state.email, this.state.password);
        GLOBALS.SOCKET.emit('register', { name: this.state.name, firstname: this.state.firstname, email: this.state.email, password: this.state.password });
        GLOBALS.SOCKET.on('register', data => {
            console.log("data: " + data.status + " / " + data.message);
            if (data.status === "ok") {
                alert("Inscription réussie !")
                this.moveConnection();
              }
              else
                alert(data.message)
        });    
      }
    });
    } else {
      alert("accepter les conditions utilisations");
    }
  };

  render() {
    return (
      <View style={containers.container}>
        <View style={blockacceuil.block2}>
          <View style={blockacceuil.logo}>
            <Text style={blockacceuil.textLogo}>+</Text>
          </View>
            <Text style={blockacceuil.textBlock}>Créer son compte</Text>
        </View>

        <View style={blockacceuil.block3}>
          <View style={blockacceuil.formulaire}>
            <TextInput
                label='Nom'
                placeholderTextColor="black"
                placeholder="Entrez votre Nom"
                style={popup.textinput}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
            />
            
            <TextInput
                label='Prénom'
                placeholderTextColor="black"
                placeholder="Entrez votre Prénom"
                style={popup.textinput}
                value={this.state.firstname}
                onChangeText={firstname => this.setState({ firstname })}
            />

            <TextInput
                label='Mot de passe'
                placeholderTextColor="black"
                placeholder="Entrez votre Mot de passe"
                style={popup.textinput}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                secureTextEntry={true}
            />

            <TextInput
                label='E-mail'
                placeholderTextColor="black"
                placeholder="Entrez votre E-mail"
                style={popup.textinput}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
            />
          
            <View style={{ flexDirection: "row", height: "5%", alignItems: "center", justifyContent: "space-between" }}>
                <Text>Condition Utilisation</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={this.validateInscription} style={blockacceuil.blockConnection2}>
          <View style={blockacceuil.logoConnection}>
            <Text style={blockacceuil.textLogoConnection}>+</Text>
          </View>
            <Text style={blockacceuil.textConnection}>Créer un compte</Text>

        </TouchableOpacity>
      </View>

    )
  }
}


export default App;
