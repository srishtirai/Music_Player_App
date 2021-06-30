const avrcpConnectionStatus = (
    state = {connected: false, address: '0.0.0.0.0.0'},
    {type, payload}
) => {
switch (type) {
    case 'AVRCP_CONNECTED':
        return {...state, ...payload};
    default:
        return state;
}
};

export default avrcpConnectionStatus;