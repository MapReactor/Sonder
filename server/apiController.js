const db = require('./db');
const redis = require('./redis');
const User = require('./models/user.js');
const Users = require('./models/users.js');
const Location = require('./models/location.js');
const Locations = require('./models/locations.js');

//TODO:
// Send back userid and username but not token
exports.getUsers = function (req, res) {
  Users.reset().fetch().then(function(users) {
    res.status(200).send(users.models);
  });
};

exports.getFriends = function (req, res) {
  if (req.params.username) {
    new User({
      username: req.params.username
    }).fetch({withRelated: 'following'}).then(function(user) {
      res.send(user);
    });
  } else {
    var error = { code: 400, message: "getFriends requires username as request parameter"};
    res.status(400).send(error);
  }
};

exports.getHistory = function (req, res) {
  if (req.params.username) {
    new User({
      username: req.params.username
    }).fetch({withRelated: 'locations'}).then(function(user) {
      res.send(user);
    });
  } else {
    var error = { code: 400, message: "getHistory requires username as request parameter"};
    res.status(400).send(error);
  }
};

//TODO get location is not currently returning the latest location, but rather is returning all location data.
exports.getLocation = function (req, res) {
  if (req.params.username) {
    redis.get(req.params.username, function(err, value){
      if (err) {
        res.send(err);
      } else {
        res.send(JSON.parse(value));
      }
    });
  } else {
    var error = { code: 400, message: "getLocation requires username as request parameter"};
    res.status(400).send(error);
  }
};

//TODO:
// 1) ensure only one user of same name
// 2) sanity check on data
exports.addUser = function (req, res) {
  if (req.body.username && req.body.token) {
    Users.create({
      username: req.body.username,
      token: req.body.token
    }).then(function(user) {
      res.send(user);
    });
  } else {
    var error = { code: 400, message: "addUser requires username and token in request body"};
    res.status(400).send(error);
  }
};

exports.addFriend = function (req, res) {
  if (req.body.username && req.body.friendname) {
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
  } else {
    var error = { code: 400, message: "addFriend requires username and friendname in request body"};
    res.status(400).send(error);
  }
};

exports.updateLocation = function (req, res) {
  if (req.body.longitude && req.body.latitude && req.body.bearing && req.body.username) {
    var location = {
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      bearing: req.body.bearing,
    };
    new User({
      username: req.body.username
    }).fetch().then(function(user) {
      location['user_id'] = user.id;
      Locations.create(location).then( function(location) {
        redis.set(req.body.username, JSON.stringify(location));
        res.send(location);
      });
    });
  } else {
    var error = { code: 400, message: "updateLocation requires username, longitude, latitude, and bearing  in request body"};
    res.status(400).send(error);
  }
};
