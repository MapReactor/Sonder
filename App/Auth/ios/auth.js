import OAuthManager from 'react-native-oauth';

const config = {
  facebook: {
    client_id: 'ENTER_CLIENT_ID',
    client_Secret: 'ENTER_CLIENT_SECRET'
  },
  google: {
    callback_url: '[IOS SCHEME]:/google',
    client_id: 'ENTER_CLIENT_ID',
    client_secret: 'ENTER_CLIENT_SECRET'
  }
};

const manager = new OAuthManager('firestackexample');
manager.configure(config);

manager.authorize('google', {scopes: 'profile email'})
.then(resp => console.log('Your users ID'))
.catch(err => console.log('Error on authorization'));