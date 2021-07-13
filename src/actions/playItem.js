import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog.js';
import playOrPauseItem from './playOrPausetem';

const playItem = (path) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp/browse',
				method: 'playItem',
				parameters: {
					itemPath: path
				},
				resolve: resolve
			},
			(res) => {
				normalLog('PlayItem Response: ' + JSON.stringify(res), {}, '');
				if(res.returnValue){
					dispatch(playOrPauseItem('play'));
				}
			}
		);
	});
};

export default playItem ;
