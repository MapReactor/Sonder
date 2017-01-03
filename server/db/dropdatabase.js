// RUN THIS COMMAND VIA:
// npm run db:drop 

const pgtools = require('pgtools');
const config = require('./config.js');

pgtools.dropdb(config, config.db, function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log('Database ' + config.db + ' dropped');
});
