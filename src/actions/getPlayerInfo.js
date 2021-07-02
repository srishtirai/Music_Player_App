import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog';
import configureStore from '../store/configureStore';
import playerInfo from "../../assets/mock/playerInfo.json";

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
				if(res.returnValue){
					dispatch({
						type: 'PLAYER_INFO',
						payload: {
							browsable: res.playerInfo[0].browsable,
							name: res.playerInfo[0].name,
							playlistPath: res.playerInfo[0].playlistPath,
							searchable: res.playerInfo[0].searchable,
							address
						}
					});
				}
				else{
					console.log(playerInfo.playerInfo[0].name)
					dispatch({
						type: 'PLAYER_INFO',
						payload: {
							browsable: true,
							name: playerInfo.playerInfo[0].name,
							playlistPath: playerInfo.playerInfo[0].playlistPath,
							searchable: playerInfo.playerInfo[0].searchable,
							address
						}
					});
					// console.log(configureStore.getState());
				}
			}
		);
	});
};

export default getPlayerInfo;
