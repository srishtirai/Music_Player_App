const setSelectedItem = (audioMetaData, index) => (dispatch) => {
  console.log(audioMetaData.path)
  return new Promise((resolve) => {
    dispatch({
      type: 'SET_SELECTED_AUDIO',
        payload: {
          audioMetaData,
          index
        }
    });
    resolve(index);
  });
};

export default setSelectedItem;
