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
import UsersApi from '../Services/UsersApi'
import GraphApi from '../Services/GraphApi'

// create custom facebook login
const FBSDK = require('react-native-fbsdk');
const Promise = require('bluebird');
const {
  LoginButton,
} = FBSDK;

var Login = React.createClass({
  render: function() {
    return (
      <View>
        <LoginButton
          readPermissions={["public_profile","email","user_friends"]}
          publishPermissions={[]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {

                const testCb = function(friendsData) {
                  console.log('you made it to the final cb', friendsData);
                }

                // posts user info to db & when complete, add friends to db
                UsersApi.addUser(UsersApi.addFriends, testCb)
              }
            }
          }
          // onLogoutFinished={() => alert("logout.")}
        />
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
