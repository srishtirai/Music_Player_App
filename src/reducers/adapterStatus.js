const adapterStatus = (
		state = {powered: false, adapterAddress: '0.0.0.0.0.0'},
		{type, payload}
) => {
	switch (type) {
		case 'ADPATERDETAILS_LOADED':
			return {...state, ...payload};
		default:
			return state;
	}
};

export default adapterStatus;
