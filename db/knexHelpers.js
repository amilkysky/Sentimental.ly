const { knex } = require('./');


const getKeywordIdByKeyword = (keyword) => {
  return knex('keywords').where({
    'keyword': keyword
  }).select('id');
};

// const getSubscriptionsByUserId = (userId) => {
//   return knex('subscriptions').where({
//     'profile_id': userId
//   }).select('*');
// };

const getSubscriptionsByUserId = (userId) => {
  return knex('subscriptions').innerJoin('keywords', 'subscriptions.keyword_id', 'keywords.id').where({
    'profile_id': userId
  }).select('*');
};

const getTweetsByKeyword = (keywordId) => {
  return knex('tweets').innerJoin('sentiments', 'sentiments.tweet_id', '=', 'tweets.id').innerJoin('keywords', 'sentiments.keyword_id', '=', 'keywords.id').where({
    'keyword_id': keywordId
  }).select('tweets.*', 'sentiments.sentiment').limit(25);
};
// example of how to modularize the twitter.js function (life goals)
// const insertTweets = (tweetEvent) => {
// 	dbModule.knex('tweets').insert({
//     tweeted_at: tweetEvent.created_at,
//     url: tweetEvent.entities.urls[0].url,
//     text: tweetEvent.text,
//     retweet_count: tweetEvent.retweeted_status.retweet_count,
//     user_name: tweetEvent.user.name,
//     profile_image_url: tweetEvent.user.profile_image_url,
//     screenname: tweetEvent.user.screen_name
//   })
//   .returning('id');
// }

const getSentimentsByKeyword = (keywordId) => {
  return knex('sentiments').where({
    'keyword_id': keywordId
  }).select('*').limit(25);
};


module.exports = {
  getKeywordIdByKeyword,
  getSubscriptionsByUserId,
  getTweetsByKeyword,
  getSentimentsByKeyword
};