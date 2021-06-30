import lunaAction from './lunaActions';
import getPlayerInfo from './getPlayerInfo';
import normalLog from '../utils/normalLog.js';

const getAVRCPStatus = (address) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp',
				method: 'getStatus',
				parameters: {
					subscribe: true,
					address: address
				},
				resolve: resolve
			},
			(res) => {
				normalLog('avrcpConnectionStatus Response: ' + JSON.stringify(res), {}, '');
				if (res.returnValue) {
					if(res.connected){
						dispatch({
							type: 'AVRCP_CONNECTED',
							payload: {
								connected: true,
								address
							}
						});
						dispatch(getPlayerInfo(address));
					}
				}
				// else{
				// 	dispatch({
				// 		type: 'AVRCP_CONNECTED',
				// 		payload: {
				// 			connected: true,
				// 			address
				// 		}
				// 	});
				// 	dispatch(getPlayerInfo(address));
				// }
			}
		);
	});
};

export default getAVRCPStatus;
