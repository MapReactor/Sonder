const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;
import GraphApi from '../Services/GraphApi'

export default {

  addUser: (user) => {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        // console.log('access token:', data.accessToken.toString())
        let accessToken = data.accessToken.toString
        GraphApi.getUserInfo(function(userInfo) {
          console.log('userInfo', userInfo);

          fetch('/api/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
          })
          .then((res) => res.json())          
          .then((resData) => {
            console.log(JSON.stringify('RESPONSE DATA', resData.body));
            alert(JSON.strigify('RESPONSE DATA', resData.body));
          })
          .catch((err) => {
            console.log('error on adding user', err);
          })
          .done();

        });
      }
    )
  }

}