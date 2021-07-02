import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog.js';

const getNumberOfItems = (address,step) => (dispatch) => {
	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp/browse',
				method: 'getNumberOfItems',
				parameters: {
					address: address
				}
			},
			(res) => {
				normalLog('getNumberOfItems Response: ' + JSON.stringify(res), {}, '');
				if (res.returnValue) {
					dispatch({
						type: 'NOOFITEMS_'+step,
						payload: {
							noOfItems: res.numberOfItems
						}
					});
					if(res.numberOfItems > 0){
						resolve(res.numberOfItems);
					}
				}
				else{
					dispatch({
						type: 'NOOFITEMS_'+step,
						payload: {
							noOfItems: 4
						}
					});
					resolve(4);
				}
			}
		);
	});
};

export default getNumberOfItems;
