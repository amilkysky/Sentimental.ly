const { knex } = require('./')

const getKeywordIdByKeyword = (keyword) => {
  return knex('keywords').where({
    'keyword': keyword
  }).select('id')
}

const getSubscriptionsByUserId = (userId) => {
  return knex('subscriptions').innerJoin('keywords', 'subscriptions.keyword_id', 'keywords.id').where({
    'profile_id': userId
  }).select('*')
}

const getTweetsByKeyword = (keywordId) => {
  return knex('tweets').innerJoin('sentiments', 'sentiments.tweet_id', '=', 'tweets.id').innerJoin('keywords', 'sentiments.keyword_id', '=', 'keywords.id').where({
    'keyword_id': keywordId
  }).select('tweets.*', 'sentiments.sentiment').orderBy('sentiments.tweet_id', 'desc').limit(25)
}

const getSentimentsByKeyword = (keywordId) => {
  return knex('sentiments').where({
    'keyword_id': keywordId
  }).select('*').orderBy('id', 'desc').limit(25)
}

module.exports = {
  getKeywordIdByKeyword,
  getSubscriptionsByUserId,
  getTweetsByKeyword,
  getSentimentsByKeyword
}
