import React, { Component } from 'react';
import { Text, View, Image, TextInput, SafeAreaView, StyleSheet, Platform, StatusBar, ScrollView, Dimensions, Button, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { RFValue } from 'react-native-responsive-fontsize';

import firebase from 'firebase';

export default class CreatePost extends Component{
  
  constructor(props) {
    super(props);
    
    this.state = {
      previewImage: "image_1",
      dropdownHeight: 40,
      light_theme: true,
      name: "",
      profile_image: ""
    };
  }

  async addPost(){
    if(this.state.caption ){
      let postData = {
        preview_image: this.state.previewImage,
        caption: this.state.caption,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        //profile_image: this.state.profile_image,
        //"profile_image" isn't loading and is being called as "undefined"
        likes: 0
      };
      //console.log(this.state.profile_image)
      await firebase.database().ref("/posts/" + (Math.random().toString(36).slice(2)))
        .set(postData).then(function (snapshot){});
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("Feed")
    }
    else{
      Alert.alert('Error', 'All Fields Are Require', 
        [{text: "OK", onPress: ()=>console.log("OK PRESSED")}]
        , {cancelable: false});
    }
  }

  async fetchUser() {
    let theme, name, image;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        image = snapshot.val().profile_picture;
        this.setState({
          light_theme: theme === "light" ? true : false,
          name: name,
          profile_image: image
        })
      })
  }

  componentDidMount(){
    this.fetchUser();
  }

  render(){
    let preview_images = {
      image_1: require("../assets/image_1.jpg"),
      image_2: require("../assets/image_2.jpg"),
      image_3: require("../assets/image_3.jpg"),
      image_4: require("../assets/image_4.jpg"),
      image_5: require("../assets/image_5.jpg"),
      image_6: require("../assets/image_6.jpg"),
      image_7: require("../assets/image_7.jpg")
    };
    return(
      <View style = {this.state.light_theme ? styles.containerLight : styles.container}>
        <SafeAreaView style = {styles.droidSafeArea}/>
        <View style = {styles.appTitle}>
          <View style = {this.state.light_theme ? styles.appIconLight : styles.appIcon}>
            <Image source = {require("../assets/logo.png")} style = {styles.iconImage}></Image>
          </View>
          <View style = {styles.appTitleTextContainer}>
            <Text style = {this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>
              New Story
            </Text>
          </View>
        </View>
        <View style = {styles.fieldsContainer}>
          <ScrollView>
            <Image source = {preview_images[this.state.previewImage]} style = {styles.previewImage}></Image>
            <View style={{ height: RFValue(this.state.dropdownHeight) }}>
              <DropDownPicker
                items = {[
                  { label: "Image 1", value: "image_1" },
                  { label: "Image 2", value: "image_2" },
                  { label: "Image 3", value: "image_3" },
                  { label: "Image 4", value: "image_4" },
                  { label: "Image 5", value: "image_5" },
                  { label: "Image 6", value: "image_6" },
                  { label: "Image 7", value: "image_7" }
                ]}

                defaultValue={this.state.previewImage}

                containerStyle={{
                  height: 40,
                  borderRadius: 20,
                  marginBottom: 10
                }}

                onOpen={() => {
                  this.setState({ dropdownHeight: 170 });
                }}

                onClose={() => {
                  this.setState({ dropdownHeight: 40 });
                }}

                style={{ backgroundColor: "transparent"}}

                itemStyle={{
                  justifyContent: "flex-start"
                }}

                dropDownStyle={{ backgroundColor: this.state.light_theme ? "#eaeaea" : "#2a2a2a"}}

                labelStyle={{
                  color: this.state.light_theme ? "black" : "white"
                }}

                arrowStyle={{
                  color:this.state.light_theme ? "black" : "white"
                }}

                onChangeItem={item =>
                  this.setState({
                    previewImage: item.value
                  })
                }
              />
            </View>
            <View style = {{marginHorizontal: RFValue(10)}}>
              <TextInput
                style={this.state.light_theme ? styles.inputFontLight : styles.inputFont}
                onChangeText={caption => this.setState({ caption })}
                placeholder={"Caption"}
                placeholderTextColor= {this.state.light_theme ? "black" : "white"}
                numberOfLines = {4}
              />
            </View>

            <View style = {styles.submitButton}>
              <Button onPress = {()=>this.addPost()} title = "Submit" color = "#f800f4"/>
            </View>

          </ScrollView>
        </View>
        <View style={{ flex: 0.08 }} />
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
  fieldsContainer: { 
    flex: 0.85 
  },
  previewImage: { 
    width: "93%", 
    height: RFValue(250), 
    alignSelf: "center", 
    borderRadius: RFValue(10),
    marginVertical: RFValue(10), 
    resizeMode: "contain" 
  },
  inputFont: { 
    height: RFValue(40),
    borderColor: "white", 
    borderWidth: RFValue(1), 
    borderRadius: RFValue(10), 
    paddingLeft: RFValue(10), 
    color: "white", 
    fontFamily: "Bubblegum-Sans",
    marginTop: 10
  },
  inputFontLight: { 
    height: RFValue(40),
    borderColor: "black", 
    borderWidth: RFValue(1), 
    borderRadius: RFValue(10), 
    paddingLeft: RFValue(10), 
    color: "black", 
    fontFamily: "Bubblegum-Sans",
    marginTop: 10
  }
});