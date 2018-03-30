module.exports.api = require('./api')
module.exports.auth = require('./auth')
module.exports.profiles = require('./profiles')
const { makeDatetimeString } = require('../../db/timestampHelper.js')

const twitter = require('../api/twitter')
const { app } = require('../app')

const knexHelpers = require('../../db/knexHelpers')

app.post('/subscribe', async (req, res) => {
  try {
    const keyword = req.body.keyword
    const profileId = req.body.profileId
    const keywordIdResponse = await twitter.createSubscription(keyword, profileId)
    res.send(keywordIdResponse)
  } catch (error) {
    console.log('Could not save data')
    console.log(error)
    res.sendStatus(400)
  }
})

// get keywordId by keyword
app.get('/keywordId/:keyword', async (req, res) => {
  console.log('keyword', req.params.keyword)

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

app.get('/initializeD3/:keyword', async (req, res) => {
  let sentiGraphScores = []

  let timeStampObj = makeDatetimeString()
  console.log('timeStampObj CHEK', timeStampObj)

  const mostRecentScore = await knexHelpers.getLatestSentimentsByKeyword(req.params.keyword, timeStampObj)
  console.log('mostRecentScore CHEK', mostRecentScore)

  const filteredRecentScores = mostRecentScore.filter(score => score.sentiment !== 0)
  console.log('filteredRecentScores CHEK', filteredRecentScores)

  let totalRecentTweets = mostRecentScore.length
  let averageRecentScore = null

  if (totalRecentTweets === 0) {
    averageRecentScore = 0
  } else {
    const mappedmostRecentScore = filteredRecentScores.map(score => score.sentiment)
    const summedRecentScore = mappedmostRecentScore.reduce((total, amount) => total + amount, 0)
    averageRecentScore = Math.ceil(summedRecentScore / totalRecentTweets)
  }

  let date = -5

  sentiGraphScores.push({date: date, close: averageRecentScore})

  for (let i = 0; i < 11; i++) {
    const pastScore = await knexHelpers.getSentimentsByKeywordWithinTimePeriod(req.params.keyword, timeStampObj)
    console.log('pastScore CHEK', pastScore)
    let totalTweets = pastScore.length
    let averageScore = null

    if (totalTweets === 0) {
      averageScore = 0
    } else {
      const mappedPastScore = pastScore.map(score => score.sentiment)
      const summedScore = mappedPastScore.reduce((total, amount) => total + amount, 0)
      averageScore = Math.ceil(summedScore / totalTweets)
    }

    date -= 5
    sentiGraphScores.push({date: date, close: averageScore})
    timeStampObj = makeDatetimeString(timeStampObj.time5MinAgo)
  }
  res.send(sentiGraphScores)
})

app.get('/updateSentiGraphScores/:selectedKeywordId', async (req, res) => {
  console.log('selectedKeywordId CHEK', req.params.selectedKeywordId)
  const mostRecentSentimentScores = await knexHelpers.getLatestSentimentsByKeyword(req.params.selectedKeywordId, makeDatetimeString())
  console.log('mostRecentSentimentScores CHEK', mostRecentSentimentScores)
  const filteredSentimentScores = mostRecentSentimentScores.filter(score => score.sentiment !== 0)
  console.log('filteredSentimentScores CHEK', filteredSentimentScores)
  res.send(filteredSentimentScores)
})
