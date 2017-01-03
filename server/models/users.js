var db = require('../db');
var User = require('./user.js');

var Users = new db.Collection();

Users.model = User;

module.exports = Users;
