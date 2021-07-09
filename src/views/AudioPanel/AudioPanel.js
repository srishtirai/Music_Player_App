import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changePath } from "../../actions/navigationActions";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import setSelectedItem from "../../actions/audioActions";
import playOrPauseItem from "../../actions/playOrPausetem";

const AudioPanel = ({
  audioItems,
  audioIndex,
  handleBack,
  setSelectedItem,
  audioMetaData,
  playOrPauseItem
}) => {
  const handleNextAudio = () => {
    if (audioItems && audioItems.length > 0) {
      if (audioIndex === audioItems.length - 1) {
        setSelectedItem(audioItems[0], 0);
      } else {
        setSelectedItem(audioItems[audioIndex + 1], audioIndex + 1);
      }
    }
  };

  const handlePreviousAudio = () => {
    if (audioItems && audioItems.length > 0) {
      if (audioIndex === 0) {
        setSelectedItem(
          audioItems[audioItems.length - 1],
          audioItems.length - 1
        );
      } else {
        setSelectedItem(
          audioItems[audioIndex - 1], audioIndex - 1
        );
      }
    }
  };

  const play = () =>{
    playOrPauseItem(play);
  };

  const pause = () =>{
    playOrPauseItem(pause);
  };

  return (
    <AudioPlayer
      autoCloseTimeout={7000}
      disabled={false}
      feedbackHideDelay={3000}
      playMusic={play}
      pauseMusic={pause}
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
      thumbnailSrc={audioMetaData.metaData.thumbnail}
      title={"Goldstone AudioPlayer "}
      titleHideDelay={4000}
    />
  );
};

AudioPanel.propTypes = {
  handleBack: PropTypes.func,
  audioIndex: PropTypes.number,
  audioItems: PropTypes.array,
  audioMetaData: PropTypes.object,
};

const mapStateToProps = ({folderItems, selectedMusic}) => {
  return {
    audioItems: folderItems.audioItems,
    audioIndex: selectedMusic.index,
    audioMetaData: selectedMusic.audioMetaData
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleBack: (path) => dispatch(changePath(path)),
    setSelectedItem: (audioMetaData, index) => dispatch(setSelectedItem(audioMetaData, index)),
    playOrPauseItem: (status) => dispatch(playOrPauseItem(status))
  };
};

export default connect(mapStateToProps, mapDispatchToState)(AudioPanel);
