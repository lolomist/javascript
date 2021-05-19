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
    //console.log(this.state.condition);
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
            this.state.passwordConfirmErrorMessage = "Confirm the new password you want to use";
            this.setState({ state: this.state });
            return ("Invalid password");
          }
          if (this.state.passwordConfirm != this.state.password) {
            alert("the password you entered doesn't match the confirmation");
            this.state.passwordConfirmError = true;
            this.state.passwordConfirmErrorMessage = "Confirm by entering the password you want to use (same as above)";
            this.setState({ state: this.state });
            return ("Invalid password");
          }
          if (this.state.password.length < 6 || !/\d/.test(this.state.password)) {
            alert("Your password must contain at least 6 characters and at least 1 number");
            this.state.passwordError = true;
            this.state.passwordErrorMessage = "Enter a valid password";
            this.setState({ state: this.state });
            return ("Invalid password");
          }

          //console.log("ICI")

          // RegisterEmmit(this.state.name, this.state.firstname, this.state.email, this.state.password);
          GLOBALS.SOCKET.emit('reset', { email: GLOBALS.EMAIL, password: this.state.password });
          GLOBALS.SOCKET.on('reset', data => {
            //console.log("data: " + data.status + " / " + data.message);
            if (data.status === "ok") {
                alert("password reseted succesfuly!");
                this.props.navigation.navigate("Connection");
            }
          });    
        }
    });
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
                  onChangeText={password => this.setState({ password })}
              />
            )}
            {this.state.passwordError && (
              <TextInput
                  label='Password'
                  placeholderTextColor="black"
                  placeholder="Enter the new password you want to use"
                  style={popup.textinputRed}
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
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
                    style={popup.textinput}
                    value={this.state.passwordConfirm}
                    onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
                />
            )}
            {this.state.passwordConfirmError && (
                <TextInput
                    label='PasswordConfirm'
                    placeholderTextColor="black"
                    placeholder="Confirm the new password you want to use"
                    style={popup.textinputRed}
                    value={this.state.passwordConfirm}
                    onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
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