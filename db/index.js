let knex = null;

if (!process.env.database) {
  knex = require('knex')(require('../knexfile'));
} else {
  knex = require('knex'); // (must fix) initialize using heroku env variables
}

const db = require('bookshelf')(knex);

db.plugin('registry');

module.exports.db = db;
module.exports.knex = knex;
