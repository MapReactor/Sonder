const FBSDK = require('react-native-fbsdk');
import GraphApi from '../Services/GraphApi'
import apisauce from 'apisauce'

export default {

  addUser: (cbOne, cbTwo) => {
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
        console.log('success adding user', JSON.stringify(res));
        console.log('friendsData', friendsData);
        cbOne(friendsData, cbTwo);
      })
      .catch((err) => {
        if (err) {
          console.log('error adding user', err.data);
        }
      });    
    });     
  },

  addFriends: (friendsData, cb) => { 
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
      console.log('success adding/ updating friends', JSON.stringify(res));

      console.log('friendsData', friendsData);
      cb(friendsData);
    })
    .catch((err) => {
      if (err) {
        console.log('error adding friends', err);
      }
    });
  },

<<<<<<< HEAD
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
=======
  getFriends: (cb) => {
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
      cb(res);
    })
    .catch((err) => {
      if (err) {
        console.log('error on fetching friends', err);
      }
    })
  },
>>>>>>> Add welcome view and friends view to navigation router and drawer content

}
