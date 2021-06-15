import {types} from '../actions/types';


const initialState = {
	isAudioListLoading: false,
	isCurrentAudioLoading: false,
	audioList: [],
	currentAudioMetaData: {},
	audioIndex: -1,
	audioListError: '',
	currentAudioError: ''
};

const audioListReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.FETCH_AUDIO_LIST_REQUEST: {
			return {
				...state,
				isAudioListLoading: true,
				audioList: [],
				audioListError: ''
			};
		}
		case types.FETCH_AUDIO_LIST_SUCCESS: {
			return {
				...state,
				isAudioListLoading: false,
				audioList: action.payload,
				audioListError: ''
			};
		}
		case types.FETCH_AUDIO_LIST_ERROR: {
			return {
				...state,
				isAudioListLoading: false,
				audioList: [],
				audioListError: action.payload
			};
		}
		case types.FETCH_CURRENT_AUDIO_REQUEST: {
			return {
				...state,
				isCurrentAudioLoading: true,
				currentAudioMetaData: {},
				currentAudioError: ''
			};
		}
		case types.FETCH_CURRENT_AUDIO_SUCCESS: {
			return {
				...state,
				isCurrentAudioLoading: false,
				audioIndex: action.index,
				currentAudioMetaData: action.payload,
				currentAudioError: ''
			};
		}
		case types.FETCH_CURRENT_AUDIO_ERROR: {
			return {
				...state,
				isCurrentAudioLoading: false,
				currentAudioMetaData: {},
				currentAudioError: action.payload
			};
		}
		default: return state;
	}
};

export default audioListReducer;
