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
import UserActions from '../Redux/UserRedux'
import { Images } from '../Themes'
import UsersApi from '../Services/UsersApi'

// create custom facebook login
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;

type LoginProps = {
  setUser: () => void,
  user: Object
}

class FBLoginView extends Component {

  props: LoginProps

  state: {
    user: Object
  }

  constructor (props: LoginProps) {
    super(props)
    this.state = {
      user: null
    }
  }

  render() {
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
                // posts user info to db & when complete, add friends to db
                UsersApi.addUser(UsersApi.addFriends);
                this.props.setUser({id:'1234', friends:['9','8','7','6','5']});
                console.tron.log('ID:'+this.state.id);
              }
            }
          }
          // onLogoutFinished={() => alert("logout.")}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
    friends: state.friends
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(UserActions.setUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FBLoginView)
