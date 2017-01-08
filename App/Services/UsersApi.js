const FBSDK = require('react-native-fbsdk');

import GraphApi from '../Services/GraphApi'
import apisauce from 'apisauce'

export default {

  addUser: () => {
    GraphApi.getUserInfo(function(userInfo, friendsData) {
      const api = apisauce.create({
        baseURL: 'http://127.0.0.1:3000',
        headers: {
          'Accept': 'text/plain',
        }
      });
      return api
      .post('/api/users', userInfo)
      .then((res) => {
        console.log('added user', JSON.stringify(res));
        // return cb(friendsData));
        console.log('friendsData', friendsData);
        return friendsData
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
    return api
    .post('/api/friends', friendsData)
    .then((res) => {
      console.log('added/ updated friends', JSON.stringify(res));
      return friendsData;
    })
    .catch((err) => {
      if (err) {
        console.log('error on adding Friends', err);
      }
    });
  },

  // getFriends: (cb) => { // todo: add param for fb_id
  //   const api = apisauce.create({
  //     baseURL: 'http://127.0.0.1:3000',
  //     headers: {
  //       'Accept': 'text/plain'
  //     }
  //   });
  //   api
  //   .get('/api/friends/:' + /*fb_id*/)
  //   .then((res) => {
  //     console.log('fetched friends', JSON.strinify(res));
  //     cb(res);
  //   })
  //   .catch((err) => {
  //     if (err) {
  //       console.log('error on fetching friends', err);
  //     }
  //   })
  // },

  // getLocations: (cb) => { // todo: add param for fb_id
  //   const api = apisauce.create({
  //     baseURL: 'http://127.0.0.1:3000',
  //     headers: {
  //       'Accept': 'text/plain'
  //     }
  //   });
  //   api
  //   .get('/api/locations/:' + /*fb_id*/)
  //   .then((res) => {
  //     console.log('fetched friends', JSON.strinify(res));
  //     cb(res);
  //   })
  //   .catch((err) => {
  //     if (err) {
  //       console.log('error on fetching friends', err);
  //     }
  //   })
  // },

}
