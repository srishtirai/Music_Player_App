import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog';

const getAdapterDetails = (name) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/adapter',
				method: 'getStatus',
				parameters: {
					subscribe: true
				},
				resolve: resolve,
				name: name
			},
			(res) => {
				normalLog('adapterDetails Response: ' + JSON.stringify(res), {}, '');
				if (res.returnValue && res.adapters.length > 0) {
					const {powered, adapterAddress} = res.adapters[0];
					if (powered) {
						resolve(adapterAddress);
					}
					dispatch({
						type: 'ADPATERDETAILS_LOADED',
						payload: {
							powered,
							adapterAddress
						}
					});
				}
				// else {
				// 	resolve("00:00:dd:41:6b:ef");
				// 	dispatch({
				// 		type: 'ADPATERDETAILS_LOADED',
				// 		payload: {
				// 			powered:true,
				// 			adapterAddress:"00:00:dd:41:6b:ef"
				// 		}
				// 	});
				// }
			}
		);
	});
};

export default getAdapterDetails;
