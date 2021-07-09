/**
 * Provides Goldstone-themed Audio player component with out of the box features.
 *
 * @exports AudioPlayer
 */
import PropTypes from "prop-types";
import React, { useReducer } from "react";
import AudioPlayerBase from "./AudioPlayerBase/AudioPlayerBase";
import AudioPlayerReducer from "./Reducers/AudioPlayerReducer";

const initialState = {
  current: 0,
  repeat: {
    type: 0,
    loop: false,
  },
};
const AudioPlayer = ({
  handleBack,
  handleNext,
  handlePrevious,
  playlist,
  playMusic,
  pauseMusic,
  ...rest
}) => {
  const [state] = useReducer(AudioPlayerReducer, initialState);
  const getAudioType = (path) => {
    let mimeType = "audio/mp3";
    if (path && path.length > 0) {
      let extension = path.substring(path.lastIndexOf(".") + 1);
      if (extension && extension.length > 0) {
        mimeType = "audio/" + extension;
      }
    }
    return mimeType;
  };
  let extType = getAudioType(playlist.path);
  return (
    <AudioPlayerBase
      {...rest}
      onJumpForward={handleNext}
      onJumpBackward={handlePrevious}
      onBack={handleBack}
      loop={state.repeat.loop}
      poster={playlist.metaData.thumbnail}
      thumbnailSrc={playlist.metaData.thumbnail}
      title={playlist.metaData.title}
      artist={playlist.metaData.artist}
      album={playlist.metaData.album}
      infoComponents={playlist.metaData.title}
      playMusic={playMusic}
      pauseMusic={pauseMusic}
    >
      <source src={playlist.path} type={extType} />
    </AudioPlayerBase>
  );
};

AudioPlayer.propTypes = {
  /**
   * Function to handle navigation
   *
   * @type {Function}
   */
  handleBack: PropTypes.func,

  /**
   * Function to handle Next audio
   *
   * @type {Function}
   */
  handleNext: PropTypes.func,

  /**
   * Function to handle Previous audio
   *
   * @type {Function}
   */
  handlePrevious: PropTypes.func,

  /**
   * Contains the list of audios to be played
   *
   * @type {Array}
   */
  playlist: PropTypes.object,
};

export default AudioPlayer;
