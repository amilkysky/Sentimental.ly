import React from 'react';

class TweetEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('tweetEntry chek', this.props.tweetEntry);
    return (
      <article className="tweetEntry">
        <span><b>{this.props.tweetEntry.sentiment}:</b>&nbsp;</span>
        <span>{this.props.tweetEntry.text}</span>
      </article>
    );
  }
}

export default TweetEntry;