var db = require('../db');
var Friend = require('./friend.js');
var Location = require('./location.js');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  friends: function() {
    return this.belongsToMany(Friend);
  },
  locations: function() {
    return this.hasMany(Location);
  },
});

module.exports = User;
