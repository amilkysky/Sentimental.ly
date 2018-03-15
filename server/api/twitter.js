const dbModule = require('../../db/');
const Twit = require('twit');
const sentiment = require('sentiment');
const { server } = require('../');
const io = require('socket.io')(server);
require('dotenv').config();


// Twitter stream working with OAuth

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  timeout_ms: 60 * 1000
});
// above: optional HTTP request timeout to apply to all requests and makes timeout 60 seconds long



// subscribe function (and then export it)
// when keyword is submitted
const createSubscription = async (keyword, profileId, res) => {

  // remember to send back a response whether successful 
 
  try {

    let keywordsArray = await dbModule.knex.select('id', 'keyword').from('keywords');

    let keywordIdResponse = null;
    let found = false;

    keywordsArray.forEach((keywordObj) => {
      if (keyword === keywordObj.keyword) {
        found = true;
        keywordIdResponse = [keywordObj.id];
      }
    });

    let streamKeywordsArray = keywordsArray.map((keywordObj) => {
      return keywordObj.keyword;
    })

    if (!found) {
      streamKeywordsArray.push(keyword);
      keywordIdResponse = await dbModule.knex('keywords').insert({
        keyword
      })
      .returning('id')
    } else {
      keywordsArray.forEach((keywordObj) => {
        if (keyword === keywordObj.keyword) {
          keywordIdResponse = [keywordObj.id];
        }
      });
    }

    let subscripsArray = await dbModule.knex('subscriptions').where({'profile_id': profileId}).select('keyword_id', 'profile_id');

    let foundKeywordId = false;

    subscripsArray.forEach((subscriptObj) => {
      if (keywordIdResponse[0] === subscriptObj.keyword_id) {
        foundKeywordId = true;
      }
    });

    if (!foundKeywordId) {
      const insertSubscription = await dbModule.knex('subscriptions').insert({
        profile_id: profileId,
        keyword_id: keywordIdResponse[0]
      });
    } 

    let stream = T.stream('statuses/filter', { track: streamKeywordsArray, language: 'en' });

    setTimeout(() => {
      stream.on('tweet', async (tweetEvent) => {

        if (!tweetEvent.retweeted_status) {
          tweetEvent.retweeted_status = {};
          tweetEvent.retweeted_status.retweet_count = 0;
        }

        if (!tweetEvent.entities.urls[0]) {
          tweetEvent.entities.urls[0] = {};
          tweetEvent.entities.urls[0].url = 'null';
        }

        const tweetIdResponse = await dbModule.knex('tweets').insert({
          tweeted_at: tweetEvent.created_at,
          url: tweetEvent.entities.urls[0].url,
          text: tweetEvent.text,
          retweet_count: tweetEvent.retweeted_status.retweet_count,
          user_name: tweetEvent.user.name,
          profile_image_url: tweetEvent.user.profile_image_url,
          screenname: tweetEvent.user.screen_name
        })
        .returning('id');

        const senti = sentiment(tweetEvent.text);
        const score = senti.score;

        // io.on('connection', ()) ??
        // io.emit('realTimeTweet', {tweetEvent, score});

        const insertSentiment = await dbModule.knex('sentiments').insert({
          sentiment: score,
          tweet_id: tweetIdResponse[0],
          keyword_id: keywordIdResponse[0]
        });
      });

      // might be a rate limit notification message
      stream.on('limit', function (limitMessage) {
        console.log('limit message', limitMessage);
      });

      // a disconnection may occur when you are connected to multiple API calls
      stream.on('disconnect', function (disconnectMessage) {
        console.log('disconnect msg', disconnectMessage);

        // if i can get the reconnection code below working, then should wrap the T.stream function in the subscriptions if statement above...
        // && above and below requirements... otherwise don't put in if block
        // (if app is actually deployed, server would supposedly stay on/open and all this code can get moved inside the if block)

        // figure out how to reconnect stream if/when it disconnects
        // let stream = T.stream('statuses/filter', { track: keyword, language: 'en' });
      }); 

      // may need to figure out how to reconnect upon disconnect
      stream.on('reconnect', function (request, response, connectInterval) {
        console.log('Reconnecting in ' + connectInterval + 'ms...');
      });

      stream.on('error', function(error) {
        console.log(error);
      });

    }, 2000);
    res.status(201);
    res.send(keywordIdResponse);
  }
  catch(error) {
    console.log('Could not save data');
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports.createSubscription = createSubscription;


