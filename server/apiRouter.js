const apiRouter = require('express').Router();
const apiController = require('./apiController.js');

apiRouter.get('/users', apiController.getUsers );
apiRouter.get('/friends', apiController.getFriends );
apiRouter.get('/history', apiController.getHistory );
apiRouter.get('/location', apiController.getLocation );

apiRouter.post('/users', apiController.addUser );
apiRouter.post('/friends', apiController.addFriend );
apiRouter.post('/location', apiController.updateLocation );

module.exports = apiRouter;
