const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;
import GraphApi from '../Services/GraphApi'
import apisauce from 'apisauce'

export default {

  addUser: (user) => {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        // console.log('access token:', data.accessToken.toString())
        let accessToken = data.accessToken.toString
        GraphApi.getUserInfo(function(userInfo) {
          console.log('userInfo', userInfo);

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
            });         

        });
      }
    )
  }

}