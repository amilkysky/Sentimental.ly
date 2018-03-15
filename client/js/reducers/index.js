import { combineReducers } from 'redux';
import keywordSubscription from './keywordSubscription';
import tweets from './tweets';

export default combineReducers({
	keywordSubscription: keywordSubscription,
	tweets: tweets
})
