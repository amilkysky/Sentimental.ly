
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tweets', function (table) {
      table.increments('id').unsigned().primary()
      table.string('tweeted_at').nullable() // ??? check on this
      table.string('url', 255).nullable() // previously 255
      table.string('text', 280).nullable()
      table.integer('retweet_count').nullable()
      table.string('user_name').nullable()
      table.string('profile_image_url').nullable()
      table.string('screenname').nullable()
      table.timestamps(true, true)
    }),
    knex.schema.createTableIfNotExists('sentiments', function (table) {
      table.increments('id').unsigned().primary()
      table.integer('sentiment').nullable()
      table.integer('tweet_id').unsigned().notNullable()
      table.foreign('tweet_id').references('tweets.id')
      table.integer('keyword_id').unsigned().notNullable()
      table.foreign('keyword_id').references('keywords.id')
    }),
    knex.schema.createTableIfNotExists('keywords', function (table) {
      table.increments('id').unsigned().primary()
      table.string('keyword').nullable()
    }),
    knex.schema.createTableIfNotExists('subscriptions', function (table) {
      table.increments('id').unsigned().primary()
      table.integer('profile_id').unsigned().notNullable()
      table.foreign('profile_id').references('profiles.id')
      table.integer('keyword_id').unsigned().notNullable()
      table.foreign('keyword_id').references('keywords.id')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tweets'),
    knex.schema.dropTable('sentiments'),
    knex.schema.dropTable('keywords'),
    knex.schema.dropTable('subscriptions')
  ])
}
