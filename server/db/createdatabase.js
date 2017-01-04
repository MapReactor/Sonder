// RUN THIS COMMAND VIA:
// npm run db:create

const pgtools = require('pgtools');
let config = require('./config.js');

config.db = config.database;
delete config.database;

pgtools.createdb(config, config.db, function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log('Database ' + config.database + ' created');
});
