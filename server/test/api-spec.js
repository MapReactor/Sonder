const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const request = require('supertest');

const config = require('./../db/config.js');
const knex = require('knex');
// const app = require('../app.js');


const clearDB = function(done) {
  knex('*').del()
  .then(function() {
    done();
  });
};

const dummyUser_one = {
  body : {
    username : 'fakeUser_one',
    token: 'fakeToken_one'
  }
}

const dummyUser_two = {
  body : {
    username : 'fakeUser_two',
    token: 'fakeToken_two'
  }
}



describe('API', function() {
  let dbConnection;

  beforeEach(function(done) {
    console.log('before each');
    // Connect to db before each test
    dbConnection = knex({
      client: 'pg',
      connection: config
    })

    // Empty the db table before each test
    clearDB(done);
  });

  afterEach(function() {
    server.end();
  });


  describe('/users', function() {

    it ('should post a user', function(done) {
      request(app).post('/users', dummyUser_one)
      request(app).post('/users', dummyUser_two)
      .expect(function(res) {
        expect(res.data).to.have.property('username')
        expect(res.data).to.have.property('token')
      })
    })

    it('should fetch all users', function(done) {
      request(app).get('/users')
      .expect(function(res) {
        expect(res.data.length).to.equal(2);
      });
    });

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



  describe('post, /friends', function() {
    // TODO
  });

  describe('post, /location', function() {
    // TODO
  });

});