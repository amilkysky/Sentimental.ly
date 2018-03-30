const knex = require('knex')(require('../knexfile'))

const db = require('bookshelf')(knex)

db.plugin('registry')

module.exports.db = db
module.exports.knex = knex