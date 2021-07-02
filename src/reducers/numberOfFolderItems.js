const noOfFolderItems = (
    state = {noOfItems:0},
    {type, payload}
) => {
switch (type) {
    case 'NOOFITEMS_INITIAL':
        return {...state, ...payload};
    case 'NOOFITEMS_FINAL':
        return {...state, ...payload};
    default:
        return state;
}
};

export default noOfFolderItems;