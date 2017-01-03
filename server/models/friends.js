var db = require('../db');
var Friend = require('./friend.js');

var Friends = new db.Collection();

Friends.model = Friend;

module.exports = Friends;
