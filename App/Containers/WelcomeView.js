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
            Sonder n.
          </Text>
          <Text style={styles.subtitle, {padding: 20}} >
            "The realization that each random passerby is living a life as vivid and complex as your own—populated with their own ambitions, friends, routines, worries and inherited craziness—an epic story that continues invisibly around you like an anthill sprawling deep underground, with elaborate passageways to thousands of other lives that you’ll never know existed, in which you might appear only once, as an extra sipping coffee in the background, as a blur of traffic passing on the highway, as a lighted window at dusk."
          </Text>
        <Login />
      </View>
    )
  }

  // componentDidMount () {
  //   // init the connection
  //   const ws = new WebSocket('ws://localhost:3000')
  //
  //   ws.onopen = () => {
  //     console.log('opening ws')
  //     // ws.send(JSON.stringify({"type": "subscribe", "friends": ["123"]}))
  //     ws.send("msg1")
  //     ws.send("msg2")
  //     ws.send("msg3")
  //   }
  //
  //   ws.onerror = (error) => {
  //     console.log('ws error: ', error)
  //     console.dir(error)
  //     ws.close();
  //   }
  //
  //   ws.onmessage = (e) => {
  //     console.log('ws message: ', e.data);
  //     // transform data
  //     // let payload = {}
  //     // payload.id = e.id
  //     // payload.longitude = e.longitude
  //     // payload.latitude = e.latitude
  //     // payload.type = 'publish'
  //     //
  //     // // dispatch an action with emitter
  //     // console.log(payload)
  //     // return emitter( { type: 'FRIENDS_LOCATIONS_UPDATE', friendLocation: payload } )
  //     // ws.close();
  //   }
  //
  //   ws.onclose = (e) => {
  //     console.log('closing ws')
  //   }
  //
  //   // unsubscribe function
  //   return () => {
  //     // interrupt the socket communication
  //     console.log('closing ws')
  //     ws.close()
  //   }
  // }
}


export default WelcomeView
