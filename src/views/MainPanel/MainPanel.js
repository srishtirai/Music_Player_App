import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { TabLayout, Tab } from "../../../goldstone/TabLayout";
import { Panel, Header } from "../../../goldstone/Panels";
import AudioList from "../../components/AudioList/AudioList";

import { changePath } from "../../actions/navigationActions";
import {
  getAudioList,
  getCurrentAudioMetaData,
} from "../../actions/audioActions";

import css from "./MainPanel.module.less";

const MainPanel = ({
  devices,
  handleNavigate,
  getListAudio,
  getAudioMetaData,
  audioList,
  ...rest
}) => {
  useEffect(() => {
    // getListAudio("storage:///media/multimedia");
  }, []);

  const handleAudioNavigate = (url, AudioMetaData, index) => {
    getAudioMetaData(AudioMetaData.uri, index);
    handleNavigate(url);
  };

  return (
    <Panel className={css.container} {...rest}>
      <Header />
        <AudioList
          audiolist={audioList}
          handleNavigate={handleAudioNavigate}
        />
    </Panel>
  );
};

MainPanel.propTypes = {
  getListAudio: PropTypes.func,
  getAudioMetaData: PropTypes.func,
  handleNavigate: PropTypes.func,
  audioList: PropTypes.array,
};

const mapStateToProps = ({audio }) => {
  return {
    audioList: audio.audioList,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleNavigate: (path) => dispatch(changePath(path)),
    getListAudio: (uri) =>
      dispatch(
        getAudioList({
          uri: uri,
        })
      ),
    getAudioMetaData: (uri, index) =>
      dispatch(
        getCurrentAudioMetaData({
          uri: uri,
          audioIndex: index,
        })
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToState)(MainPanel);
