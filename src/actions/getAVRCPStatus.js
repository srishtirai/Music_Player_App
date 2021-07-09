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
					dispatch({
						type: 'AVRCP_CONNECTED',
						payload: {
							connected: res.connected,
							address
						}
					});
					if(res.connected){
						dispatch(getPlayerInfo(address));
						resolve(address);
					}
				}
				else{
					dispatch({
						type: 'AVRCP_CONNECTED',
						payload: {
							connected: true,
							address
						}
					});
					dispatch(getPlayerInfo(address));
					resolve(address);
				}
			}
		);
	});
};

export default getAVRCPStatus;
