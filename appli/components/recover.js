import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { containers, blockacceuil, popup } from '../components/styles'
import GLOBALS from "../components/globals.js";
import NetInfo from '@react-native-community/netinfo';
// import { RegisterEmmit, RegisterReceive } from './socket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      alertMessage: '',
      condition: true,
      emailError: false,
      emailErrorMessage: ''
    }
    this.validateRecover = this.validateRecover.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  //Fontion pour enregistrer un compte dans la BDD
  validateRecover() {
    console.log(this.state.condition);
    if (this.state.condition == true) {

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
              alert("No connection detected, please check your connection");
            } else {
              this.state.emailError = false;
              let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          
              console.log(this.state.email)
              if (!re.test(this.state.email)) {
                alert("Please enter a valid email address");
                this.state.emailError = true;
                this.state.emailErrorMessage = "Enter a valid email address";
                this.setState({ state: this.state });
                return ("Invalid email address");
              }

              // RegisterEmmit(this.state.name, this.state.firstname, this.state.email, this.state.password);
              GLOBALS.SOCKET.emit('recover', { email: this.state.email, deviceId: GLOBALS.DEVICEID.toString() });
              GLOBALS.SOCKET.on('recover', data => {
                console.log("data: " + data.status + " / " + data.message);
                if (data.status === "ok") {
                    alert("Check your emails!")
                    this.props.navigation.navigate("Recover");
                }
                else {
                  if (data.message === "No account with this email address.") {
                    this.state.emailError = true;
                    this.state.emailError = "There is not account with this email";
                    this.setState({ state: this.state });
                  } else
                    alert(data.message)
                }
              });
              GLOBALS.SOCKET.on('reseting', data => {
                console.log("data: " + data.status + " / " + data.message);
                if (data.status === "ok") {
                    GLOBALS.EMAIL = this.state.email;
                    this.props.navigation.navigate("Reset");
                }
              });    
            }
        });
    }
  };

  render() {
    return (
      <View style={containers.container}>
        <View style={blockacceuil.block2}>
          <View style={blockacceuil.logo}>
            <Text style={blockacceuil.textLogo}>+</Text>
          </View>
            <Text style={blockacceuil.textBlock}>Recover an account</Text>
        </View>

        <View style={blockacceuil.block3}>
          <View style={blockacceuil.formulaire}>
            {!this.state.emailError && (
              <TextInput
                  label='E-mail'
                  placeholderTextColor="black"
                  placeholder="Enter your account's E-mail"
                  style={popup.textinput}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
              />
            )}
            {this.state.emailError && (
              <TextInput
                  label='E-mail'
                  placeholderTextColor="black"
                  placeholder="Enter your account's E-mail"
                  style={popup.textinputRed}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
              /> 
            )}
            {this.state.emailError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.emailErrorMessage}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={this.validateRecover} style={blockacceuil.blockConnection2}>
          <View style={blockacceuil.logoConnection}>
            <Text style={blockacceuil.textLogoConnection}>+</Text>
          </View>
            <Text style={blockacceuil.textConnection}>Recover</Text>

        </TouchableOpacity>
      </View>

    )
  }
}

export default App;