var db = require('../db');
var User = require('./user.js');

var Friend = db.Model.extend({
  tableName: 'friendlist',
  hasTimestamps: false,
  users: function() {
    return this.belongsToMany(User);
  },
});

module.exports = Friend;
