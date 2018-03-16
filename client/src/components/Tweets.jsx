import React from 'react'
import TweetEntry from './TweetEntry.jsx'

class Tweets extends React.Component {
  render () {
    let sentimentUrls = {
      poor: 'https://imgur.com/a/iNTMR',
      average: 'https://imgur.com/a/iNTMR',
      positive: 'https://imgur.com/a/iNTMR'
    }

    return (
      <div className="tweetsContainer">
        <ul>
          {this.props.tweetsArray.map((tweet, i) => {
            let img = sentimentUrls.average
            if (tweet.sentiment <= 3) {
              img = sentimentUrls.poor
            } else if (tweet.sentiment >= 3 && tweet.sentiment <= 6) {
              img = sentimentUrls.average
            } else {
              img = sentimentUrls.positive
            }
            return <li key={i}><TweetEntry tweetEntry={tweet} /></li>
          })}
        </ul>
      </div>
    )
  }
}

export default Tweets
