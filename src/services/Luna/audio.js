import luna from './request';

const audioService = {

	getAudioList: ({uri, ...rest}) => {
		let params = {
			uri: uri
		};
		return luna('com.webos.service.mediaindexer', 'getAudioList', params)(rest);
	},

	getAudioMetaData: ({uri, ...rest}) => {
		let params = {
			uri: uri
		};
		return luna('com.webos.service.mediaindexer', 'getAudioMetadata', params)(rest);
	}
};

export default audioService;
export {
	audioService
};
