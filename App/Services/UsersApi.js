const FBSDK = require('react-native-fbsdk');

import GraphApi from '../Services/GraphApi'
import apisauce from 'apisauce'

export default {

  addUser: (cb) => {
    GraphApi.getUserInfo(function(userInfo, friendsList) {
      const api = apisauce.create({
        baseURL: 'http://127.0.0.1:3000',
        headers: {
          'Accept': 'text/plain',
        }
      })
      api
      .post('/api/users', userInfo)
      .then((res) => {
        console.log('added user', JSON.stringify(res));
        cb(friendsList)
      })
      .catch((err) => {
        if (err) {
          console.log('error on adding user', err);
        }
      });    
    });     
  },

  addFriends: (friendsList) => { 
    // "addFriend requires username and friendname in request body"
    const api = apisauce.create({
      baseURL: 'http://127.0.0.1:3000',
      headers: {
        'Accept': 'text/plain',
      }
    })
    api
    .post('/api/friends', friendsList)
    .then((res) => {
      console.log('added/ updated friends', JSON.stringify(res));
    })
    .catch((err) => {
      if (err) {
        console.log('error on adding Friends', err);
      }
    });
  }

}