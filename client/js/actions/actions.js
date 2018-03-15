import { ActionTypes as types } from '../helpers/constants';

export const subscribeToKeyword = (keywordIds, keywords) => {
	return {
		type:types.SUBSCRIBE_TO_KEYWORD,
		data:{
			keywordIds: keywordIds,
			keywords: keywords
		}
	}
}

export const keywordInputChange = (keywordInput) => {
	return {
		type:types.KEYWORD_INPUT_CHANGE,
		data:{keywordInput: keywordInput}
	}
}

export const initializeKeywords = (keywordIds, keywords, selectedKeywordId) => {
	return {
		type:types.INITIALIZE_KEYWORDS,
		data:{
			keywordIds: keywordIds,
			keywords: keywords,
			selectedKeywordId: selectedKeywordId
		}
	}
}

export const showTweetsForKeywordId = (tweetData) => {
	return {
		type:types.SHOW_TWEETS_FOR_KEYWORD_ID,
		data:{tweets: tweetData}
	}
}

export const changeSelectedKeywordId = (selectedKeywordId) => {
  return {
  	type:types.CHANGE_SELECTED_KEYWORD_ID,
  	data:{selectedKeywordId: selectedKeywordId}
  }
}
