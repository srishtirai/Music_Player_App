import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog';

const getPlayerInfo = (address) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp',
				method: 'getPlayerInfo',
				parameters: {
					subscribe: true,
                    address: address
				},
				resolve: resolve
			},
			(res) => {
                normalLog('playerInfo : ' + JSON.stringify(res), {}, '');
				if(res.returnValue && res.browsable){
					dispatch({
						type: 'PLAYER_INFO',
						payload: {
							browsable: true,
							name: res.name,
							playlistPath: res.playlistPath,
							searchable: res.searchable,
							address
						}
					});
				}
				// else{
				// 	dispatch({
				// 		type: 'PLAYER_INFO',
				// 		payload: {
				// 			browsable: true,
				// 			name: res.name,
				// 			playlistPath: res.playlistPath,
				// 			searchable: res.searchable,
				// 			address
				// 		}
				// 	});
				// }
			}
		);
	});
};

export default getPlayerInfo;
