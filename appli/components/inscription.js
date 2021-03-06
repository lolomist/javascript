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
      username: '',
      password: '',
      email: '',
      alertMessage: '',
      condition: true,
      usernameError: false,
      usernameErrorMessage: 'test',
      emailError: false,
      emailErrorMessage: '',
      passwordError: false,
      passwordErrorMessage: '',
      popupRecupMdp: false
    }
    this.validateInscription = this.validateInscription.bind(this);
    this.moveConnection = this.moveConnection.bind(this);
    this.showPopupRecupMdp = this.showPopupRecupMdp.bind(this);
    this.hidePopupRecupMdp = this.hidePopupRecupMdp.bind(this);
    this.moveToRecover = this.moveToRecover.bind(this);
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
    //console.log(this.state.condition);
    if (this.state.condition == true) {

      // test de connection
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert("No connection detected, please check your connection");
        } else {
          this.state.usernameError = false;
          this.state.emailError = false;
          this.state.passwordError = false;
          let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          this.setState({ state: this.state });
          // error management
          if (!this.state.username) {
            alert("Please fill in all fields");
            this.state.usernameError = true;
            this.state.usernameErrorMessage = "This field is required";
            this.setState({ state: this.state });
            return ("Invalid username");
          }
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
          if (this.state.username.includes("@")) {
            alert("Please enter a valid username");
            this.state.usernameError = true;
            this.state.usernameErrorMessage = "Enter a valid username without '@'";
            this.setState({ state: this.state });
            return ("Invalid username");
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

          // RegisterEmmit(this.state.name, this.state.firstname, this.state.email, this.state.password);
          GLOBALS.SOCKET.emit('register', { username: this.state.username, email: this.state.email, password: this.state.password });
          GLOBALS.SOCKET.on('register', data => {
            //console.log("data: " + data.status + " / " + data.message);
            if (data.status === "ok") {
                alert("Registration succesful !")
                this.moveConnection();
            } else {
              //console.log(data.message)
              if (data.message === "Email already in use.") {
                this.state.emailError = true;
                this.state.emailErrorMessage = "There is already an account with this email";
                this.showPopupRecupMdp();
              } else if (data.message === "Username already in use.") {
                alert("Username already in use.")
                this.state.usernameError = true;
                this.state.usernameErrorMessage = "This username is already taken";
                this.setState({ state: this.state });
              } else
                alert(data.message)
            }
          });   
        }
      });
    }
  };

  showPopupRecupMdp() {
    this.setState({ popupRecupMdp: true });
  };
  hidePopupRecupMdp() {
    this.setState({ popupRecupMdp: false });
  };
  moveToRecover() {
    this.props.navigation.navigate("Recover");
  };

  render() {
    return (
      <View style={containers.container}>
        <View style={blockacceuil.block2}>
          <View style={blockacceuil.logo}>
            <Text style={blockacceuil.textLogo}>+</Text>
          </View>
            <Text style={blockacceuil.textBlock}>Create an account</Text>
        </View>

        <View style={blockacceuil.block3}>
          <View style={blockacceuil.formulaire}>
            {!this.state.usernameError && (
              <TextInput
                  label='Username'
                  placeholderTextColor="black"
                  placeholder="Enter your username"
                  style={popup.textinput}
                  value={this.state.username}
                  onChangeText={username => this.setState({ username })}
              /> 
            )}
            {this.state.usernameError && (
              <TextInput
                  label='Username'
                  placeholderTextColor="black"
                  placeholder="Enter your username"
                  style={popup.textinputRed}
                  value={this.state.username}
                  onChangeText={username => this.setState({ username })}
              /> 
            )}
            {this.state.usernameError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.usernameErrorMessage}</Text>
            )}

            {!this.state.emailError && (
              <TextInput
                  label='E-mail'
                  placeholderTextColor="black"
                  placeholder="Enter your E-mail"
                  style={popup.textinput}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
              />
            )}
            {this.state.emailError && (
              <TextInput
                  label='E-mail'
                  placeholderTextColor="black"
                  placeholder="Enter your E-mail"
                  style={popup.textinputRed}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
              /> 
            )}
            {this.state.emailError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.emailErrorMessage}</Text>
            )}

            
            {!this.state.passwordError && (
              <TextInput
                  label='Password'
                  placeholderTextColor="black"
                  placeholder="Enter your password"
                  style={popup.textinput}
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                  secureTextEntry={true}
              />
            )}
            {this.state.passwordError && (
              <TextInput
                  label='Password'
                  placeholderTextColor="black"
                  placeholder="Enter your password"
                  style={popup.textinputRed}
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                  secureTextEntry={true}
              />
            )}
            {this.state.passwordError && (
              <Text style={{fontSize: 13, fontWeight: '500', color: "red", textAlign: 'right', marginRight: 50}}>{this.state.passwordErrorMessage}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={this.validateInscription} style={blockacceuil.blockConnection2}>
          <View style={blockacceuil.logoConnection}>
            <Text style={blockacceuil.textLogoConnection}>+</Text>
          </View>
            <Text style={blockacceuil.textConnection}>Create account</Text>

        </TouchableOpacity>

        {this.state.popupRecupMdp && (
          <View style={popup.popup}>
            <View style={popup.popup2}>
              <View style={containers.container}>
                <Text style={{ fontSize: 25}}>An account with this email already exists. Do you want to recover your account?</Text>
                <View style={{width:"100%",alignItems:"center", top: "50%"}}>
                  <TouchableOpacity onPress={this.moveToRecover} style={blockacceuil.blockConnection2}>
                    <View style={blockacceuil.logoConnection}>
                      <Text style={blockacceuil.textLogoConnection2}>?</Text>
                    </View>
                      <Text style={blockacceuil.textConnection}>Account recovery</Text>
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

export default App;
