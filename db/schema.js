// // const knex = require('knex')({
// //   client: 'pg',
// //   connection: 'postgres://otukpesfzjzjeg:c687f73bbb44519ecf3248c6c48f0efa6d0f537c4662e2c3616458b4be015366@ec2-23-21-121-220.compute-1.amazonaws.com:5432/d33vmddqmrcp61',
// //   searchPath: ['knex', 'public']
// // })

// // const db = require('bookshelf')(knex)

// // db.plugin('registry')

// // module.exports.db = db
// // module.exports.knex = knex

// const database = require('./index.js')
// const db = database.db
// const knex = db.knex

// console.log('Running schema.js to create tables!')

// knex.schema.createTableIfNotExists('profiles', function (table) {
//   table.increments('id').unsigned().primary()
//   table.string('first', 100).nullable()
//   table.string('last', 100).nullable()
//   table.string('display', 100).nullable()
//   table.string('email', 100).nullable().unique()
//   table.string('phone', 100).nullable()
//   table.timestamps(true, true)
// })
//   .then()

// knex.schema.createTableIfNotExists('tweets', function (table) {
//   table.increments('id').unsigned().primary()
//   table.string('tweeted_at').nullable() // ??? check on this
//   table.string('url', 255).nullable() // previously 255
//   table.string('text', 350).nullable()
//   table.integer('retweet_count').nullable()
//   table.string('user_name').nullable()
//   table.string('profile_image_url').nullable()
//   table.string('screenname').nullable()
//   table.timestamps(true, true)
// })
//   .then()

// knex.schema.createTableIfNotExists('sentiments', function (table) {
//   table.increments('id').unsigned().primary()
//   table.integer('sentiment').nullable()
//   table.integer('tweet_id').unsigned().notNullable()
//   table.foreign('tweet_id').references('id').inTable('tweets')
//   table.integer('keyword_id').unsigned().notNullable()
//   table.foreign('keyword_id').references('id').inTable('keywords')
// })
//   .then()

// knex.schema.createTableIfNotExists('keywords', function (table) {
//   table.increments('id').unsigned().primary()
//   table.string('keyword').unique().nullable()
// })
//   .then()

// knex.schema.createTableIfNotExists('subscriptions', function (table) {
//   table.increments('id').unsigned().primary()
//   table.integer('profile_id').unsigned().notNullable()
//   table.foreign('profile_id').references('id').inTable('profiles')
//   table.integer('keyword_id').unsigned().notNullable()
//   table.foreign('keyword_id').references('id').inTable('keywords')
// })
//   .then()

// knex.schema.createTableIfNotExists('auths', function (table) {
//   table.increments('id').unsigned().primary()
//   table.string('type', 8).notNullable()
//   table.string('oauth_id', 30).nullable()
//   table.string('password', 100).nullable()
//   table.string('salt', 100).nullable()
//   table.integer('profile_id').unsigned().notNullable()
//   table.foreign('profile_id').references('id').inTable('profiles').onDelete('CASCADE')
// })
//   .then()

// console.log('made tables')
