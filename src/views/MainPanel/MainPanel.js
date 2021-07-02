import { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Panel, Header } from "../../../goldstone/Panels";
import AudioList from "../../components/AudioList/AudioList";

import { changePath } from "../../actions/navigationActions";
import {
  getAudioList,
  getCurrentAudioMetaData,
} from "../../actions/audioActions";
import getFolderItems from '../../actions/getFolderItems';
import getNumberOfItems from '../../actions/getNumberOfItems';
import css from "./MainPanel.module.less";

const MainPanel = ({
  handleNavigate,
  getAudioMetaData,
  getFolderItems,
  getNumberOfItems,
  audioList,
  playerInfo,
  address,
  folderPath,
  folderItems,
  avrcpStatus,
  noOfItems,
  audioItems,
  ...rest
}) => {
  useEffect(() => { 
    // getNumberOfItems(address,'MUSIC_LIST').then((noOfItems)=>{
    //   console.log("No of Items MUSIC LIST: "+noOfItems)
		// 				console.log("address: "+address)
		// 	getFolderItems(address,noOfItems,'MUSIC_LIST');
		// });
  }, [address, noOfItems, folderPath]);

  const handleAudioNavigate = (url, AudioMetaData, index) => {
    getAudioMetaData(AudioMetaData.uri, index);
    handleNavigate(url);
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
  getNumberOfItems: PropTypes.func,
  changeItemPath: PropTypes.func,
  handleNavigate: PropTypes.func,
  audioList: PropTypes.array,
  playerInfo: PropTypes.object
};

const mapStateToProps = ({audio,playerInfo,folderPath,avrcpConnectionStatus, folderItems,noOfFolderItems}) => {
  return {
    audioList: audio.audioList,
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
    getNumberOfItems: (address,step) => dispatch(getNumberOfItems(address,step)),
    getFolderItems: (address,res,step) => dispatch(getFolderItems(address,res,step)),
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
