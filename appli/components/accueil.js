import React, { Component } from 'react'
import { 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
 } from 'react-native';
 import { containers, blockacceuil } from '../components/styles'
 import AsyncStorage from '@react-native-community/async-storage'
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

  refresh() {

    this.moveSansCompte();
    this.intervalID = setTimeout(this.refresh.bind(this), 1000);
  }


  //Navigation vers la page connection
  moveSansCompte() {

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
