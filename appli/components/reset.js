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
      password: '',
      passwordConfirm: '',
      alertMessage: '',
      condition: true,
      passwordError: false,
      passwordErrorMessage: '',
      passwordConfirmError: false,
      passwordConfirmErrorMessage: ''
    }
    this.validateReset = this.validateReset.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  //Fontion pour enregistrer un compte dans la BDD
  validateReset() {
    console.log(this.state.condition);
    if (this.state.condition == true) {

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
              alert("No connection detected, please check your connection");
            } else {
              this.state.passwordError = false;
              this.state.passwordConfirmError = false;
              
              if (!this.state.password) {
                alert("Please fill in all fields");
                this.state.passwordError = true;
                this.state.passwordErrorMessage = "Enter a new password you want to use";
                this.setState({ state: this.state });
                return ("Invalid password");
              }
              if (!this.state.passwordConfirm) {
                alert("Please fill in all fields");
                this.state.passwordConfirmError = true;
                this.state.passwordConfirmErrorMessage = "Confirm the password password you want to use";
                this.setState({ state: this.state });
                return ("Invalid password");
              }
              if (this.state.passwordConfirm != this.state.password) {
                alert("the password you entered doesn't matched the confirmation");
                this.state.passwordConfirmError = true;
                this.state.passwordConfirmErrorMessage = "Confirm by entering the password you want to use (same as above)";
                this.setState({ state: this.state });
                return ("Invalid password");
              }

              // RegisterEmmit(this.state.name, this.state.firstname, this.state.email, this.state.password);
              GLOBALS.SOCKET.emit('recover', { email: this.state.email });
              GLOBALS.SOCKET.on('recover', data => {
                console.log("data: " + data.status + " / " + data.message);
                if (data.status === "ok") {
                    alert("Check your emails!")
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
            <Text style={blockacceuil.textBlock}>Reset your password</Text>
        </View>

        <View style={blockacceuil.block3}>
          <View style={blockacceuil.formulaire}>
            {!this.state.passwordError && (
              <TextInput
                  label='Password'
                  placeholderTextColor="black"
                  placeholder="Enter the new password you want to use"
                  style={popup.textinput}
                  value={this.state.password}
                  onChangeText={email => this.setState({ password })}
              />
            )}
            {this.state.passwordError && (
              <TextInput
                  label='Password'
                  placeholderTextColor="black"
                  placeholder="Enter the new password you want to use"
                  style={popup.textinputRed}
                  value={this.state.password}
                  onChangeText={email => this.setState({ password })}
              /> 
            )}
            {this.state.passwordError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.passwordErrorMessage}</Text>
            )}
            {!this.state.passwordConfirmError && (
                <TextInput
                    label='PasswordConfirm'
                    placeholderTextColor="black"
                    placeholder="Confirm the new password you want to use"
                    style={popup.textinputRed}
                    value={this.state.passwordConfirm}
                    onChangeText={email => this.setState({ passwordConfirm })}
                />
            )}
            {this.state.passwordConfirmError && (
                <TextInput
                    label='PasswordConfirm'
                    placeholderTextColor="black"
                    placeholder="Confirm the new password you want to use"
                    style={popup.textinputRed}
                    value={this.state.passwordConfirm}
                    onChangeText={email => this.setState({ passwordConfirm })}
                />
            )}
            {this.state.passwordConfirmError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.passwordConfirmErrorMessage}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={this.validateReset} style={blockacceuil.blockConnection2}>
          <View style={blockacceuil.logoConnection}>
            <Text style={blockacceuil.textLogoConnection}>+</Text>
          </View>
            <Text style={blockacceuil.textConnection}>Reset password</Text>

        </TouchableOpacity>
      </View>

    )
  }
}

export default App;