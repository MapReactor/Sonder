var db = require('../db');
var Bookshelf = require('bookshelf');
var Location = require('./location.js');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  following: function() {
    return this.belongsToMany('User', 'users_users', 'follower_id', 'user_id');
  },
  followers: function() {
    return this.belongsToMany('User', 'users_users', 'user_id', 'follower_id');
  },
  locations: function() {
    return this.hasMany(Location);
  },
});

module.exports = db.model('User', User);
