const selectedMusicStatus = (
	state = { status:''},
	{type, payload}
) => {
switch (type) {
	case 'SELECTED_MUSIC_STATUS':
		return {...state, ...payload};
	default:
		return state;
}
};

export default selectedMusicStatus;