// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native'
import styles from './Styles/WelcomeViewStyle'
import { Images } from '../Themes'

// create custom facebook login
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;
      
var Login = React.createClass({
  render: function() {
    return (
      <View>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
});

class WelcomeView extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.logo} style={styles.welcomeImage} resizeMode='stretch' />
        <Text style={styles.sectionText}>
          Sonder
        </Text>
        <Text style={styles.subtitle} >
          Some super awesome subtitle
        </Text>
        <Login />
      </View>
    )
  }
}

export default WelcomeView
