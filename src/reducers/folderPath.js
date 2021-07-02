const folderPath = (
    state = {path:''},
    {type, payload}
) => {
switch (type) {
    case 'FOLDER_PATH_CHANGED':
        return {...state, ...payload};
    default:
        return state;
}
};

export default folderPath;