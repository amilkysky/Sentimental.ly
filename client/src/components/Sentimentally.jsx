import React from 'react'
import axios from 'axios'
import Tweets from './Tweets.jsx'
import Keywords from './Keywords.jsx'
import * as actions from '../../js/actions/actions'
import { connect } from 'react-redux'
// import SentimentTracker from './SentimentTracker.jsx';
// import d3 from 'd3';
// import rd3 from 'react-d3-library';

class Sentimentally extends React.Component {
  constructor (props) {
    super(props)

    // this.fetchTweetsHandler = this.fetchTweetsHandler.bind(this);
    this.init = this.init.bind(this)
    this.selectKeywordIdHandler = this.selectKeywordIdHandler.bind(this)
    this.fetchLatest = this.fetchLatest.bind(this)
  }

  componentDidMount () {
    this.init(this.props.profileId)
  }

  // NOTE: corresponding action creator must return thunk function, not action obj
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

  /*
        this.setState({
          keywordIds: keywordIds,
          keywords: keywords,
          selectedKeywordId: keywordIds[0]
        }, () => this.fetchTweetsHandler(this.state.selectedKeywordId));

  // redux attempt
        .then(() => this.fetchTweetsHandler(selectedKeywordId));
  */

  // fetchTweetsHandler(keywordId) {
  //   axios.get(`/tweets/${keywordId}`)
  //     .then((tweetsArray) => {
  //       let tweetData = tweetsArray.data;

  //       this.props.dispatch(actions.showTweetsForKeywordId(tweetData));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  /*
        this.setState({
          tweets: tweetData
        });
  */

  /*
  STEPS FOR REFACTORING this.setState({}) => Redux
    1) remove this.setState fn
    2) replace with this.props.dispatch(data)
    3) make/modify appropriate action creator function in actions.js
    4) make appropriate corresponding switch case in reducer function
  */

  // NOTE: corresponding action creator must return thunk function, not action obj
  selectKeywordIdHandler (event) {
    let keyword = event.target.value
    axios.get(`/keywordId/${keyword}`)
      .then((keywordId) => {
        this.props.dispatch(actions.changeSelectedKeywordId(keywordId))
        // .then(() => this.fetchTweetsHandler(selectedKeywordId));
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // this.setState({
  //   selectedKeywordId: keywordId.data[0].id
  // }, () => this.fetchTweetsHandler(this.state.selectedKeywordId));

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

  /*
  this.setState({
    keywordIds: keywordIds,
    keywords: keywords
  });
  */

  render () {
    return (
      <div>
        <h1>Sentimental.ly</h1>
        <Keywords fetchLatest={this.fetchLatest} profileId={this.props.profileId} selectKeyword={this.selectKeywordIdHandler} keywordsArray={this.props.keywords} />
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
