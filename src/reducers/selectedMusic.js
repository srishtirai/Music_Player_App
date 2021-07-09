const selectedMusic = (
	state = { audioMetaData: {}, index: 0},
	{type, payload}
) => {
switch (type) {
	case 'SET_SELECTED_AUDIO':
		return {...state, ...payload};
	default:
		return state;
}
};

export default selectedMusic;
