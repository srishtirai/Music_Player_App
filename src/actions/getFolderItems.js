import lunaAction from './lunaActions';
import normalLog from '../utils/normalLog.js';
import changePath  from './changePath';
import mockAudioList from "../../assets/mock/audioList.json";
import initialFolder from "../../assets/mock/folderItemsInitial.json"

const getFolderItems = (address, noOfItems, step) => (dispatch) => {

	return new Promise((resolve) => {
		lunaAction(
			{
				service: 'luna://com.webos.service.bluetooth2/avrcp/browse',
				method: 'getFolderItems',
				parameters: {
					address: address,
                    startIndex: 0,   
                    endIndex: noOfItems-1
				},
				resolve: resolve
			},
			(res) => {
				normalLog('getFolderItems Response: ' + JSON.stringify(res), {}, '');
				if (res.returnValue) {
						if(res.folderItems != []){
							if(step==='INITIAL'){
								for (let i=0; i < res.folderItems.length; i++) {
									if (res.folderItems[i].name === "/Filesystem/My library") {
										dispatch(changePath(address, res.folderItems[i].path))
										resolve(res.folderItems[i].path);
									}
								}
								dispatch({
									type: 'FOLDER_ITEMS_'+step,
									payload: {
										folderItems: res.folderItems
									}
								});
							}
							else if(step==='FINAL'){
								for (let i=0; i < res.folderItems.length; i++) {
									if (res.folderItems[i].name === "/Filesystem/My library/Tracks") {
										dispatch(changePath(address, res.folderItems[i].path))
										resolve(res.folderItems[i].path);
									}
								}
							}
							dispatch({
								type: 'FOLDER_ITEMS_'+step,
								payload: {
									audioItems: res.folderItems
								}
							});
						}
						else{
							dispatch({
								type: 'FOLDER_ITEMS_'+step,
								payload: {
									audioItems: res.folderItems
								}
							});
						}
				}
				else{
				if(step==='INITIAL') {
					res=initialFolder;
					for (let i=0; i < res.folderItems.length; i++) {
						if (res.folderItems[i].name === "/Filesystem/My library") {
							dispatch(changePath(address, res.folderItems[i].path))
							resolve(res.folderItems[i].path);
						}
					}
					dispatch({
						type: 'FOLDER_ITEMS_'+step,
						payload: {
							folderItems: res.folderItems
						}
					});
				}

				else if(step==='FINAL') {
					dispatch(changePath(address, "player0/Filesystem/item3/item7"));
					resolve("player0/Filesystem/item3/item7");
				}
				else{
					dispatch({
						type: 'FOLDER_ITEMS_'+step,
						payload: {
							audioItems: mockAudioList.folderItems
						}
					});
				}
				}
			}
		);
	});
};

export default getFolderItems;
