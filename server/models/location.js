var db = require('../db');
var User = require('./user.js');

var Location = db.Model.extend({
  tableName: 'locations',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Location;
