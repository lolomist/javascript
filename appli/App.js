import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { createAppContainer } from 'react-navigation'
import Accueil from './components/accueil'
import Inscription from './components/inscription'
import Connection from './components/connection'
import Recover from './components/recover'
import Reset from './components/reset'
import GLOBALS from "./components/globals.js";
import { Connect } from './components/socket';

const socketModule = require('./components/socket');

const AppNavigator = createStackNavigator({
  Accueil: {screen: Accueil },
  Connection: {screen: Connection },
  Inscription: {screen: Inscription },
  Recover: {screen: Recover },
  Reset: {screen: Reset }
},
{
initialRouteName: 'Accueil',
header: null,
headerMode: 'none',
}
);

const Appcontainer = createAppContainer(AppNavigator);
export default class App extends React.Component {
  
    componentDidMount() {
      this.onConnectSocket();
    }
  
    onConnectSocket = () => {
      Connect();
    }
  
  render(){
      return(
        <Appcontainer />
      );
    }
  }