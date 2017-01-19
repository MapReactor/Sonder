import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
const FBSDK = require('react-native-fbsdk')
import Login from './FBLoginView'


export default class MenuLogin extends Component {
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
