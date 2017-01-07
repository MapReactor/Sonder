const FBSDK = require('react-native-fbsdk');

import GraphApi from '../Services/GraphApi'
import apisauce from 'apisauce'

export default {

  addUser: (cb) => {
    GraphApi.getUserInfo(function(userInfo, friendsData) {
      const api = apisauce.create({
        baseURL: 'http://127.0.0.1:3000',
        headers: {
          'Accept': 'text/plain',
        }
      });
      api
      .post('/api/users', userInfo)
      .then((res) => {
        console.log('added user', JSON.stringify(res));
        cb(friendsData)
      })
      .catch((err) => {
        if (err) {
          console.log('error on adding user', err.data);
        }
      });    
    });     
  },

  addFriends: (friendsData) => { 
    console.log('friendsData', friendsData);
    const api = apisauce.create({
      baseURL: 'http://127.0.0.1:3000',
      headers: {
        'Accept': 'text/plain',
      }
    });
    api
    .post('/api/friends', friendsData)
    .then((res) => {
      console.log('added/ updated friends', JSON.stringify(res));
    })
    .catch((err) => {
      if (err) {
        console.log('error on adding Friends', err);
      }
    });
  },

  getFriends: (friendsData) => {
    const api = apisauce.create({
      baseURL: 'http://127.0.0.1:3000',
      headers: {
        'Accept': 'text/plain'
      }
    });
    api
    .get('/api/friends')
    .then((res) => {
      console.log('fetched friends', JSON.strinify(res));
    })
    .catch((err) => {
      if (err) {
        console.log('error on fetching friends', err);
      }
    })
  },

}