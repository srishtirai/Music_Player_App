import { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Panel, Header } from "../../../goldstone/Panels";
import AudioList from "../../components/AudioList/AudioList";

import { changePath } from "../../actions/navigationActions";
import setSelectedItem from "../../actions/audioActions";
import css from "./MainPanel.module.less";
import playItem from "../../actions/playItem";

const MainPanel = ({
  handleNavigate,
  getAudioMetaData,
  getFolderItems,
  getNumberOfItems,
  playerInfo,
  address,
  folderPath,
  folderItems,
  setSelectedItem,
  avrcpStatus,
  noOfItems,
  audioItems,
  playItem,
  ...rest
}) => {
  useEffect(() => { 
  }, [address, noOfItems, folderPath]);

  const handleAudioNavigate = (url, audioMetaData, index) => {
    console.log(index)
    setSelectedItem(audioMetaData, index);
    handleNavigate(url);
    playItem(audioMetaData.path);
  };
  
  return (
    <Panel className={css.container} {...rest}>
      <Header />
        <AudioList
          audiolist={audioItems}
          handleNavigate={handleAudioNavigate}
        />
    </Panel>
  );
};

MainPanel.propTypes = {
  getAudioMetaData: PropTypes.func,
  getFolderItems: PropTypes.func,
  setSelectedItem: PropTypes.func,
  getNumberOfItems: PropTypes.func,
  changeItemPath: PropTypes.func,
  handleNavigate: PropTypes.func,
  playerInfo: PropTypes.object
};

const mapStateToProps = ({playerInfo,folderPath,avrcpConnectionStatus, folderItems,noOfFolderItems}) => {
  return {
    playerInfo: playerInfo,
    avrcpStatus: avrcpConnectionStatus,
    audioItems: folderItems.audioItems,
    noOfItems:noOfFolderItems.noOfItems,
    folderPath: folderPath.path
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleNavigate: (path) => dispatch(changePath(path)),
    setSelectedItem: (audioMetaData, index) => dispatch(setSelectedItem(audioMetaData, index)),
    playItem: (path) => dispatch(playItem(path))
  };
};

export default connect(mapStateToProps, mapDispatchToState)(MainPanel);
