import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { TabLayout, Tab } from "../../../goldstone/TabLayout";
import { Panel, Header } from "../../../goldstone/Panels";
import AudioList from "../../components/AudioList/AudioList";

import { changePath } from "../../actions/navigationActions";
import { getDeviceList } from "../../actions/deviceActions";
import {
  getAudioList,
  getCurrentAudioMetaData,
} from "../../actions/audioActions";

import css from "./MainPanel.module.less";

const MainPanel = ({
  devices,
  handleNavigate,
  getListDevice,
  getListAudio,
  getAudioMetaData,
  audioList,
  ...rest
}) => {
  useEffect(() => {
    getListDevice();
  }, []);

  const handleAudioNavigate = (url, AudioMetaData, index) => {
    getAudioMetaData(AudioMetaData.uri, index);
    handleNavigate(url);
  };

  return (
    <Panel {...rest}>
      <Header />
      <TabLayout>
        {devices.map((device) => {
          return (
            device.deviceList.length > 0 &&
            device.deviceList.map((deviceList, index) => {
              return (
                <Tab
                  className={css.tab}
                  key={deviceList.uri}
                  icon="usb"
                  onTabClick={() => getListAudio(deviceList.uri)}
                  title={deviceList.name}
                >
                  <AudioList
                    key={index}
                    audiolist={audioList}
                    handleNavigate={handleAudioNavigate}
                  />
                </Tab>
              );
            })
          );
        })}
      </TabLayout>
    </Panel>
  );
};

MainPanel.propTypes = {
  deviceList: PropTypes.array,
  getListDevice: PropTypes.func,
  getListAudio: PropTypes.func,
  getAudioMetaData: PropTypes.func,
  handleNavigate: PropTypes.func,
  audioList: PropTypes.array,
};

const mapStateToProps = ({ device, audio }) => {
  return {
    devices: device.deviceList,
    audioList: audio.audioList,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    handleNavigate: (path) => dispatch(changePath(path)),
    getListDevice: () =>
      dispatch(
        getDeviceList({
          subscribe: true,
        })
      ),
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
