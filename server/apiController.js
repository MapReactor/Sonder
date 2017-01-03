const db = require('./db');
const User = require('./models/user.js');
const Users = require('./models/users.js');
const Location = require('./models/location.js');
const Locations = require('./models/locations.js');
//const Friend = require('./models/friend.js');
//const Friends = require('./models/friends.js');

//TODO:
// Send back userid and username but not token
exports.getUsers = function (req, res) {
  Users.reset().fetch().then(function(users) {
    res.status(200).send(users.models);
  });
};

exports.getFriends = function (req, res) {
  new User({
    username: req.params.username
  }).fetch({withRelated: 'following'}).then(function(user) {
    res.send(user);
  });
};

exports.getHistory = function (req, res) {
  new User({
    username: req.params.username
  }).fetch({withRelated: 'locations'}).then(function(user) {
    res.send(user);
  });
};

//TODO get location is not currently returning the latest location, but rather is returning all location data. 
exports.getLocation = function (req, res) {
  new User({
    username: req.params.username
  }).fetch({withRelated: 'locations'}).then(function(user) {
    res.send(user.relations.locations);
  });
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
};

exports.addFriend = function (req, res) {
  new User({
    username: req.body.username
  }).fetch().then(function(user) {
    new User({
      username: req.body.friendname
    }).fetch().then(function(friend) {
      user.following().attach(friend);
      res.send(user);
    });
  });
};

exports.updateLocation = function (req, res) {
  //TODO
  new User({
    username: req.body.username
  }).fetch().then(function(user) {
    Locations.create({
      user_id: user.id,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      bearing: req.body.bearing,
    }).then( function(location) {
      res.send(location);
    });
  });
};
