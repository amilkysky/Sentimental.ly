module.exports.api = require('./api')
module.exports.auth = require('./auth')
module.exports.profiles = require('./profiles')

const twitter = require('../api/twitter')
const { app } = require('../app')

const knexHelpers = require('../../db/knexHelpers')

app.post('/subscribe', (req, res) => {
  const keyword = req.body.keyword
  const profileId = req.body.profileId
  twitter.createSubscription(keyword, profileId, res)
})

// get keywordId by keyword
app.get('/keywordId/:keyword', async (req, res) => {
  const keywordId = await knexHelpers.getKeywordIdByKeyword(req.params.keyword)
  res.send(keywordId)
})

// utility/admin route for sanity checking -- not for production
// app.get('/allTweets', (req, res) => {
//   // query db for all tweets
//   // dbModule.knex.raw(SELECT * FROM tweets)
//   // res.send(data) back to client
// })

// gets subscriptions for the logged-in user (normal http get request)
app.get('/subscriptions/:profile_id', async (req, res) => {
  // query db for subscriptions by profileId
  // knexHelpers.knex.raw(SELECT * FROM subscriptions WHERE profile_id = req.params.profile_id)
  const subscriptions = await knexHelpers.getSubscriptionsByUserId(req.params.profile_id)
  // res.send(data) back to client
  // console.log('data CHEK', data)
  res.send(subscriptions)
})

// gets historical tweets filtered on keyword
app.get('/tweets/:keyword_id', async (req, res) => {
  // query db for tweets by keywordId
  // dbModule.knex.raw(SELECT * FROM tweets WHERE keyword = req.params.keyword)
  const tweets = await knexHelpers.getTweetsByKeyword(req.params.keyword_id)
  // res.send(data) back to client
  res.send(tweets)
})

// emits tweets in real-time to client along with sentiment scores (adds tweet info and sentiment score to response object)
// likely to be changed to socket.io --> which would live in the twitter file, somewhere in the stream.on function
// [placeholder for socket.io emit function that emits tweets gotten by Twit]

// old way this might have been done
// app.get('/tweets/:keyword_id', (req, res) => {
//   // query db for sentiment(s) and tweetData
//   // res.send(data) back to client

// })

// api endpoint which will be accessed by polling from client (arbitrary (5min?) setInterval or node-cron)
app.get('/sentiments/:keyword_id', async (req, res) => {
  // query db for sentiment scores by keyword
  // .then()
  // algorithm bundles scores into 5-min pos/neg ratio data points (maybe in an array, which will be used to render a graph to the client)
  // res.send(data) back to client
  const sentiments = await knexHelpers.getSentimentsByKeyword(req.params.keyword_id)

  res.send(sentiments)
})
