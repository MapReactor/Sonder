var db = require('../db');
var Location = require('./location.js');

var Locations = new db.Collection();

Locations.model = Location;

module.exports = Locations;
