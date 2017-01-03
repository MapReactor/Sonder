const config = require('./config.js');

var knex = require('knex')({
  client: 'pg',
  connection: config
});

var db = require('bookshelf')(knex);
db.plugin('registry');

db.knex.schema.hasTable('users')
.then( function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username', 255);
      table.string('token', 255);
      table.unique('username');
    })
    .then(function (table) {
      db.knex.schema.hasTable('users_users')
      .then( function(exists) {
        if (!exists) {
          db.knex.schema.createTable('users_users', function (table) {
            table.increments('id').primary();
            table.integer('user_id').references('id').inTable('users');
            table.integer('follower_id').references('id').inTable('users');
          })
          .then( function (table) {
            db.knex.schema.hasTable('locations')
            .then( function(exists) {
              if (!exists) {
                db.knex.schema.createTable('locations', function (table) {
                  table.increments('id').primary();
                  table.integer('user_id').references('id').inTable('users');
                  table.float('longitude');
                  table.float('latitude');
                  table.float('bearing');
                  table.timestamps();
                  //table.foreign('user_id').references('id').inTable('users');
                })
                .then( function (table) {
                  console.log('Created tables');
                });
              }
            });
          });
        }
      });
    });
  }
});





module.exports = db;
