import lunaAction from './lunaActions';
import avrcpConnect from './avrcpConnect';
import normalLog from '../utils/normalLog.js';

const getBTDetails = (adapterAddress, name) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/device',
				method: 'getStatus',
				parameters: {
					adapterAddress,
					subscribe: true
				},
				resolve: resolve,
				name: name
			},
			(res) => {
				normalLog('BTDetails Response: ' + JSON.stringify(res), {}, '');
				if (res.returnValue && res.devices && res.devices.length > 0) {
					const connectedDevice = res.devices.find((value) =>
						value.connectedProfiles.includes('avrcp')
					);
					normalLog('getBTDetails Response: ' + JSON.stringify(connectedDevice), {}, '');
					if (connectedDevice) {
						const address = connectedDevice.address;
						const deviceName = connectedDevice.name;
						dispatch({
							type: 'BTDETAILS_LOADED',
							payload: {
								connected: true,
								address,
								name: deviceName
							}
						});
						if (address) {
							// dispatch(avrcpConnect(address));
							resolve(address);
						}
					} else {
						dispatch({
							type: 'BTDETAILS_LOADED',
							payload: {
								connected: false
							}
						});
					}
				}
				// else {
				// 	const address = "00:18:6b:4e:47:03";
				// 	// dispatch(avrcpConnect(address));
				// 	resolve(address);
				// 	dispatch({
				// 		type: 'BTDETAILS_LOADED',
				// 			payload: {
				// 				connected: true,
				// 				address,
				// 				name: 'LG'
				// 			}
				// 	});
				// }
			}
		);
	});
};

export default getBTDetails;
