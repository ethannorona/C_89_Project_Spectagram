import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import firebase from 'firebase';

export default class LoadingScreen extends Component{
  componentDidMount(){
    this.checkIfLogedIn();
  }

  checkIfLogedIn = () =>{
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.props.navigation.navigate("DashboardScreen");
      }
      else {
        this.props.navigation.navigate("LoginScreen");
      }
    })
  }

  render(){
    return(
      <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size = "large"/>
      </View>
    );
  }
}