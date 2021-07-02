import lunaAction from './lunaActions';
import getPlayerInfo from './getPlayerInfo';
import normalLog from '../utils/normalLog.js';

const changeItemPath = (address, path) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp/browse',
				method: 'changePath',
				parameters: {
					address: address,
                    itemPath: path
				},
				resolve: resolve
			},
			(res) => {
				normalLog('changePath Response: ' + JSON.stringify(res), {}, '');
				if (res.returnValue) {
						dispatch({
							type: 'FOLDER_PATH_CHANGED',
							payload: {
								path
							}
						});
						resolve(path);
				}
				// else{
				// 	dispatch({
				// 		type: 'FOLDER_PATH_CHANGED',
				// 		payload: {
				// 			path
				// 		}
				// 	});
				// 	resolve(path);
				// }
			}
		);
	});
};

export default changeItemPath;
