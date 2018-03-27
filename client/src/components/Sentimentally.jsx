import React from 'react'
import axios from 'axios'
import Tweets from './Tweets.jsx'
import Keywords from './Keywords.jsx'
import * as actions from '../../js/actions/actions'
import { connect } from 'react-redux'
import D3Table from './D3.jsx'

class Sentimentally extends React.Component {
  constructor (props) {
    super(props)

    this.init = this.init.bind(this)
    this.selectKeywordIdHandler = this.selectKeywordIdHandler.bind(this)
    this.fetchLatest = this.fetchLatest.bind(this)
  }

  componentDidMount () {
    this.init(this.props.profileId)

    setTimeout(() => {
      this.makeGraph()
    }, 2000)

    setInterval(() => {
      this.props.dispatch(actions.refreshedTweets(this.props.selectedKeywordId))
    }, 10000)
  }

  init (profileId) {
    axios.get(`/subscriptions/${this.props.profileId}`)
      .then((subscriptions) => {
        let keywordIds = subscriptions.data.map(keyword => {
          return keyword.keyword_id
        })
        let keywords = subscriptions.data.map(keyword => {
          return keyword.keyword
        })
        let selectedKeywordId = keywordIds[0]

        this.props.dispatch(actions.initializeKeywords(keywordIds, keywords, selectedKeywordId))
        this.props.dispatch(actions.fetchTweets(selectedKeywordId))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  makeGraph () {
    let tweetSentiments = this.props.tweets.map((tweet, i) => {
      return {date: i, close: tweet.sentiment}
    })

    this.props.dispatch(actions.updateTweetSentiments(tweetSentiments))
  }

  selectKeywordIdHandler (event) {
    let keyword = event.target.value
    axios.get(`/keywordId/${keyword}`)
      .then((keywordId) => {
        this.props.dispatch(actions.changeSelectedKeywordId(keywordId))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchLatest (keywordIdResponse) {
    axios.get(`/subscriptions/${this.props.profileId}`)
      .then((subscriptions) => {
        let keywordIds = subscriptions.data.map(keyword => {
          return keyword.keyword_id
        })
        let keywords = subscriptions.data.map(keyword => {
          return keyword.keyword
        })

        this.props.dispatch(actions.subscribeToKeyword(keywordIds, keywords))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render () {
    return (
      <div>
        <h1>Sentimental.ly</h1>
        <Keywords fetchLatest={this.fetchLatest} profileId={this.props.profileId} selectKeyword={this.selectKeywordIdHandler} keywordsArray={this.props.keywords} />
        <D3Table />
        <Tweets tweetsArray={this.props.tweets} />
      </div>
    )
  }
}

export default connect((state, props) => {
  return {
    profileId: state.keywordSubscription.profileId,
    keywordIds: state.keywordSubscription.keywordIds,
    tweets: state.tweets.tweets,
    selectedKeywordId: state.tweets.selectedKeywordId,
    keywords: state.tweets.keywords
  }
})(Sentimentally)
