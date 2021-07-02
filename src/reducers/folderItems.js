const folderItems = (
    state = {folderItems:[],audioItems:[]},
    {type, payload}
) => {
switch (type) {
    case 'FOLDER_ITEMS_INITIAL':
        return {...state, ...payload};
    case 'FOLDER_ITEMS_FINAL':
        return {...state, ...payload};
    case 'FOLDER_ITEMS_MUSIC_LIST':
        return {...state, ...payload};
    default:
        return state;
}
};

export default folderItems;