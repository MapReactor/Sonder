import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  Image,
  Linking,
  AppRegistry,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
} from 'react-native';
const FBSDK = require('react-native-fbsdk')
import Login from './FBLoginView'
import menuStyles from './Styles/MenuStyle'


let menuIsHidden = true

class MenuLogin extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <Login />
      </TouchableOpacity>
    )
  }
}

export default class Menu extends Component {
  state = {
    bounceValue: new Animated.Value(100),  // Initial position of the menu
  }
  constructor(props){
    super(props)
  }

  _toggleSubview() {
    let toValue = 100
    if (menuIsHidden) {
      toValue = 20
    }
    // Animates the transalteY of the menu subview between 0 & 100
    // 100 is the height of the menu subview
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: toValue,
        velocity: 4,
        tension: 3,
        friction: 5,
      }
    ).start();
    menuIsHidden = !menuIsHidden
  }

  render(){
    return (
      <View>
        <TouchableOpacity onPress={()=> {this._toggleSubview()}}>
          <Image source={require('../Images/mapreactor.png')} style={menuStyles.sonderButton}></Image>
        </TouchableOpacity>

        <View style={menuStyles.container}>
          <Animated.View
            style={[
              menuStyles.subview,
              {transform: [{translateY: this.state.bounceValue}]}
            ]}
          >
            <MenuLogin style={menuStyles.facebookButton} onPress={()=> {this._toggleSubview()}}> </MenuLogin>
            <TouchableHighlight underlayColor="rgba(225, 225, 225, 0.3)" onPress={()=> {this._toggleSubview()}}>
              <Text style={menuStyles.textButton}>Cancel</Text>
            </TouchableHighlight>
          </Animated.View>
        </View>
      </View>
   )
  }
}
