import lunaAction from './lunaActions';
import getAVRCPStatus from './getAVRCPStatus';
import normalLog from '../utils/normalLog.js';

const avrcpConnect = (address) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp',
				method: 'connect',
				parameters: {
					address
				},
				resolve: resolve
			},
			(res) => {
				normalLog('avrcpConnect Response: ' + JSON.stringify(res), {}, '');
				resolve(address);
			}
		);
	});
};
export default avrcpConnect;
