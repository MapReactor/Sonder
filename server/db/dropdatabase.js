// RUN THIS COMMAND VIA:
// npm run db:drop

const pgtools = require('pgtools');
const config = require('./config.js');

config.db = config.database;
delete config.database;

pgtools.dropdb(config, config.db, function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log('Database ' + config.database + ' dropped');
});
