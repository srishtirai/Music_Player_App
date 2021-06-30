const BTStatus = (
		state = {connected: false, address: '0.0.0.0.0.0'},
		{type, payload}
) => {
	switch (type) {
		case 'BTDETAILS_LOADED':
			return {...state, ...payload};
		default:
			return state;
	}
};

export default BTStatus;
