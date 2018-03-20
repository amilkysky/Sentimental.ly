const { server } = require('../server/index.js')
const chai = require('chai')
const { expect } = require('chai')
const Twit = require('twit')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

let connected = false

describe('Functions & APIs', () => {
  before(() => {
  })
  after(() => {
    server.close(() => console.log(`server no longer listening on port ${process.env.PORT}`))
  })

  describe('Twit API', () => {
    before(() => {
      var T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_SECRET,
        timeout_ms: 60 * 1000
      })
      let stream = T.stream('statuses/filter', 'Disney')
      stream.on('connected', function (response) {
        connected = true
      })
    })

    it('connects to Twitter stream', () => {
      setTimeout(() => {
        expect(connected).to.equal(true)
        connected = false
      }, 3000)
    })
  })
})
