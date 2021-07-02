import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePath } from "../../actions/navigationActions";
import { getCurrentAudioMetaData } from "../../actions/audioActions";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";

const AudioPanel = ({
  audioMetaData,
  audioList,
  audioIndex,
  handleBack,
  getAudioMetaData,
}) => {
  const handleNextAudio = () => {
    if (audioList && audioList.length > 0) {
      if (audioIndex === audioList.length - 1) {
        getAudioMetaData(audioList[0].uri, 0);
      } else {
        getAudioMetaData(audioList[audioIndex + 1].uri, audioIndex + 1);
      }
    }
  };

  const handlePreviousAudio = () => {
    if (audioList && audioList.length > 0) {
      if (audioIndex === 0) {
        getAudioMetaData(
          audioList[audioList.length - 1].uri,
          audioList.length - 1
        );
      } else {
        getAudioMetaData(audioList[audioIndex - 1].uri, audioIndex - 1);
      }
    }
  };

  return (
    <AudioPlayer
      autoCloseTimeout={7000}
      disabled={false}
      feedbackHideDelay={3000}
      handleBack={() => handleBack("home")}
      handleNext={handleNextAudio}
      handlePrevious={handlePreviousAudio}
      miniFeedbackHideDelay={2000}
      muted={false}
      noAutoPlay={false}
      noAutoShowMediaControls={false}
      noMediaSliderFeedback={false}
      noSlider={false}
      pauseAtEnd
      playlist={audioMetaData}
      seekDisabled={false}
      spotlightDisabled={false}
      thumbnailSrc={audioMetaData.thumbnail}
      title={"Goldstone AudioPlayer "}
      titleHideDelay={4000}
    />
  );
};

AudioPanel.propTypes = {
  getAudioMetaData: PropTypes.func,
  handleBack: PropTypes.func,
  audioIndex: PropTypes.number,
  audioList: PropTypes.array,
  audioMetaData: PropTypes.object,
};

const mapStateToProps = ({
  audio: { currentAudioMetaData, audioList, audioIndex },
}) => {
  return {
    audioMetaData: currentAudioMetaData,
    audioList: audioList,
    audioIndex: audioIndex,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleBack: (path) => dispatch(changePath(path)),
    getAudioMetaData: (uri, index) =>
      dispatch(
        getCurrentAudioMetaData({
          uri: uri,
          audioIndex: index,
        })
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToState)(AudioPanel);
