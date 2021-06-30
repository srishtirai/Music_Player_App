const playerInfo = (
    state = {browsable: false,
            name: '',
            playlistPath: '',
            searchable: false,
            address: ''
    },
    {type, payload}
) => {
switch (type) {
    case 'PLAYER_INFO':
        return {...state, ...payload};
    default:
        return state;
}
};

export default playerInfo;