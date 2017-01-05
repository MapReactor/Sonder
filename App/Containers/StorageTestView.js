// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import StorageTestActions from '../Redux/StorageTestRedux'
import { connect } from 'react-redux'
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  TextInput,
} from 'react-native'
import styles from './Styles/StorageTestStyle'
import { Images } from '../Themes'

class StorageTestView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      text: '',
    };

    // MANIPULATE STATE
    this.incrementViaStates = (() => {
      this.setState({'count': this.state.count + 1})
    }).bind(this);

    this.decrementViaStates = (() => {
      this.setState({'count': this.state.count - 1})
    }).bind(this);

    this.resetState = (() => {
      this.setState({'count': 0})
    }).bind(this);

    // MANIPULATE STORE
    this.increment = (() => {
      this.props.increment();
    }).bind(this);

    this.decrement = (() => {
      this.props.decrement();
    }).bind(this);

    this.incrementBy = (() => {
      const { input } = this.state;
      this.props.incrementBy(this.state.text);
    }).bind(this);

    this.reset = (() => {
      this.props.reset();
    }).bind(this);

  }

  render () {
    var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
         TouchableElement = TouchableNativeFeedback;
        }

    return (
      <View style={styles.mainContainer}>

        {/* Change states using React */}
        <View style={styles.section}>

          <Text style={styles.sectionText}>react state</Text>

          <TouchableElement onPress={this.incrementViaStates}>
            <Text style={styles.sectionText}>INCREMENT STATE</Text>
          </TouchableElement>

          <TouchableElement onPress={this.decrementViaStates}>
            <Text style={styles.sectionText}>DECREMENT STATE</Text>
          </TouchableElement>

          <TouchableElement onPress={this.resetState}>
            <Text style={styles.sectionText}>RESET STATE</Text>
          </TouchableElement>

          <Text style={styles.sectionText}>{this.state.count}</Text>

        </View>

        {/* Change states using Redux */}
        <View style={styles.section}>

          <Text style={styles.sectionText}>redux store</Text>

          <TouchableElement onPress={this.increment}>
            <Text style={styles.sectionText}>INCREMENT STORE</Text>
          </TouchableElement>

          <TouchableElement onPress={this.decrement}>
            <Text style={styles.sectionText}>DECREMENT STORE</Text>
          </TouchableElement>

          <TouchableElement onPress={this.incrementBy}>
            <Text style={styles.sectionText}>INCREMENT STORE BY {this.state.text}</Text>
          </TouchableElement>

          <TextInput
            style={{height: 30, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />

          <TouchableElement onPress={this.reset}>
            <Text style={styles.sectionText}>RESET STORE</Text>
          </TouchableElement>

          <Text style={styles.sectionText}>{this.props.storageTest.count}</Text>

        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    storageTest: state.storageTest
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch(StorageTestActions.increment()),
    decrement: () => dispatch(StorageTestActions.decrement()),
    incrementBy: (input) => dispatch(StorageTestActions.incrementBy(input)),
    reset: () => dispatch(StorageTestActions.reset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageTestView)
