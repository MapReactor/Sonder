const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

const getUserInfo = (cb) => {
  const resCallback = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.log('Success fetching data: ', JSON.stringify(result));
      const userInfo = {
        token: token,
        email: result.email,
        displayname: result.name,
        id: result.id,
      }

      const friendsRes = result.friends.data;
      const friendList = friendsRes.map((friend) => {
        return friend.id;
      });
      const friendsData = {
        id: result.id,
        friendlist: friendList,
      }

      cb(userInfo, friendsData);
    }
  }

  let token;
  AccessToken.getCurrentAccessToken().then(
    (data) => {
      token = data.accessToken.toString();
    }
  )

  const reqConfig = {
    httpMethod: 'GET',
    version: 'v2.5',
    parameters: { fields: { string: 'id, name, email, friends' } },
    accessToken: token,
  }

  // Create a graph request asking for user information with a callback to handle the response.
  const infoRequest = new GraphRequest(
    'me/',
    reqConfig,
    resCallback,
  );

  // Start the graph request.
  return new GraphRequestManager().addRequest(infoRequest).start();
}

export default {
  getUserInfo: getUserInfo
}


