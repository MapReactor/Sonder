const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const request = require('supertest');

const config = require('./config.js');
const pgtools = require('pgtools');
const knex = require('knex');
const app = require('../app.js');

chai.use(require('chai-things'));


var clearDB = function(done) {
  pgtools.dropdb(config, config.db, function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log('Database ' + config.db + ' dropped');
  });
};

const dummyData; // TODO


describe('API', function() {
  const server;

  before(function(done) {
    // TODO
  });

  beforeEach(function(done) {
    // TODO
  });

  afterEach(function() {
    server.close();
  });


  describe('get, /users', function() {
    // TODO
  });

  describe('get, /friends/:username', function() {
    // TODO
  });

  describe('get, /history/:username', function() {
    // TODO
  });

  describe('get, /location/:username', function() {
    // TODO
  });

  describe('post, /users', function() {
    // TODO
  });

  describe('post, /friends', function() {
    // TODO
  });

  describe('post, /location', function() {
    // TODO
  });

});