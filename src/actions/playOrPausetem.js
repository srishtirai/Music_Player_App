import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog.js';

const playOrPauseItem = (status) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp',
				method: 'sendPassThroughCommand',
				parameters: {
					keyCode: status,
					keyStatus: "pressed"
				},
				resolve: resolve
			},
			(res) => {
				normalLog('PlayOrPauseOnPhone Response: ' + JSON.stringify(res), {}, '');
				if(res.returnValue){
					dispatch({
						type: 'SELECTED_MUSIC_STATUS',
						payload: {
							status
						}
					});
				}
			}
		);
	});
};

export default playOrPauseItem ;
