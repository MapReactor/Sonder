const db = require('./db');
const User = require('./models/user.js');
const Users = require('./models/users.js');
const Location = require('./models/location.js');
const Locations = require('./models/locations.js');
const Friend = require('./models/friend.js');
const Friends = require('./models/friends.js');

//TODO:
// Send back userid and username but not token
exports.getUsers = function (req, res) {
  Users.reset().fetch().then(function(users) {
    res.status(200).send(users.models);
  });
};

exports.getFriends = function (req, res) {
  console.log('getFriends');
  res.send(db.users);
};
exports.getHistory = function (req, res) {
  console.log('getHistory');
  res.send(db.users);
};
exports.getLocation = function (req, res) {
  console.log('getLocation');
  res.send(db.users);
};

//TODO:
// 1) ensure only one user of same name
// 2) sanity check on data
exports.addUser = function (req, res) {
  Users.create({
    username: req.body.username,
    token: req.body.token
  }).then(function(user) {
    res.send(user);
  });
  // Student.findOne({username: req.body.username, classroom: req.body.classroom }, function(err, student) {
  //   if (err) {
  //     res.status(500);
  //     res.send({ error: 'Error retrieving student record' });
  //   } else if (!student || req.body.password !== student.password ) {
  //     res.status(401);
  //     res.send({ error: 'Invalid username or password' });
  //   } else {
  //     util.createSession(req, res, student);
  //     res.send(student);
  //   }
  // });
};

exports.addFriend = function (req, res) {
  Friends.create({
    user: req.body.username,
    friend: req.body.friendname
  }).then(function(user) {
    res.send(user);
  });
};
exports.updateLocation = function (req, res) {
  console.log('updateLocation');
  res.send(db.users);
};
