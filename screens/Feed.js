import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native-gesture-handler'
import PostCard from './PostCard';

import firebase from 'firebase';

export default class Feed extends Component{
constructor(props) {
    super(props);

    this.state = {
      light_theme: true,
      posts: []
    }
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme
        this.setState({
          light_theme: theme === "light"
        })
      })
  }

  componentDidMount(){
    this.fetchPosts();
    this.fetchUser();
  }
  
  fetchPosts = () => {
    firebase.database().ref("/posts/").on("value", (snapshot)=>{
      let posts = []
      if(snapshot.val()){
        Object.keys(snapshot.val()).forEach(function (key){
          posts.push({
            key: key,
            value: snapshot.val()[key]
          })
        })
      }
      this.setState({
        posts: posts
      });
      this.props.setUpdateToFalse();      
    }, function (errorObject){
      console.log("Read Failed: " + errorObject.code);
    })
  }

 renderItem = ({item: post}) =>{
   return <PostCard post = {post} navigation = {this.props.navigation} />
 }

 keyExtractor = (item,index) => index.toString();

  render(){
    return(
      <View style = {this.state.light_theme ? styles.containerLight : styles.container}>
        <SafeAreaView style = {styles.droidSafeArea}/>
        <View style = {styles.appTitle}>
          <View style = {this.state.light_theme ? styles.appIconLight : styles.appIcon}>
            <Image source = {require('../assets/logo.png')} style = {styles.iconImage}></Image>
          </View>
          <View style = {styles.appTitleTextContainer}>
            <Text style = {this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>Spectagram</Text>
          </View>
        </View>
        <View style = {styles.cardContainer}>
          <FlatList
            keyExtractor = {this.keyExtractor}
            data = {this.state.posts}
            renderItem = {this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: "#0f0f0f" 
  }, 
  containerLight: { 
    flex: 1, 
    backgroundColor: "#ffffff" 
  }, 
  droidSafeArea: {
     marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35) 
  }, 
  appTitle: { 
    flex: 0.07, 
    flexDirection: "row" 
  }, 
  appIcon: { 
    flex: 0.3, 
    justifyContent: "center", 
    alignItems: "center" 
  }, 
  appIconLight: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "darkgrey"
  },
  iconImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "contain" 
  }, 
  appTitleTextContainer: { 
    flex: 0.7, 
    justifyContent: "center" 
  }, 
  appTitleText: { 
    color: "white", 
    fontSize: RFValue(28), 
    fontFamily: "Bubblegum-Sans" 
  }, 
  appTitleTextLight: { 
    color: "black", 
    fontSize: RFValue(28), 
    fontFamily: "Bubblegum-Sans" 
  }, 
  cardContainer: {
     flex: 0.93 
  } 
});