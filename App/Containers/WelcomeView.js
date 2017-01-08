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
import Login from './FBLoginView'

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
