const apiRouter = require('express').Router();
const apiController = require('./apiController.js');

apiRouter.get('/users', apiController.getUsers );
apiRouter.get('/friends/:username', apiController.getFriends );
apiRouter.get('/history/:username', apiController.getHistory );
apiRouter.get('/location/:username', apiController.getLocation );

apiRouter.post('/users', apiController.addUser );
apiRouter.post('/friends', apiController.addFriend );
apiRouter.post('/location', apiController.updateLocation );

module.exports = apiRouter;
