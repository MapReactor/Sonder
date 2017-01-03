const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter.js');

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

module.exports = function(app, express) {
  //app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(allowCrossDomain);
  app.use(express.static(__dirname + '/www'));
  app.use('/api', apiRouter);
};
