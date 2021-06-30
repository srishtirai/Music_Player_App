import React from "react";
import PropTypes from "prop-types";
import ImageItem from "../../../goldstone/ImageItem";
import { VirtualGridList } from "../../../goldstone/VirtualList/VirtualList";
import ri from "@enact/ui/resolution";
import placeHolderImg from "../../../assets/images/defaultmusic.jpg";
import { getEncodedPath } from "../AudioPlayer/AudioPlayerBase/util";

import css from './AudioList.module.less';

const audioList = ({ audiolist, handleNavigate }) => {
  const getDuration=(duration)=>{
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  };
  
  const renderItem = ({ index, ...rest }) => {
    let encodedPath = getEncodedPath(audiolist[index].thumbnail);

    return (<>
      <ImageItem
        {...rest}
        className={css.imageItem}
        src={encodedPath}
        oreintation="horizontal"
        placeholder={placeHolderImg}
        onClick={() => handleNavigate("/audioplayer", audiolist[index], index)}
      />
      <div className={css.audioInfo} onClick={() => handleNavigate("/audioplayer", audiolist[index], index)}>
        <strong className={css.title}>{audiolist[index].title.replace('mp3','')}</strong>
        <p className={css.subtitle}>
          {(audiolist[index].artist?audiolist[index].artist:audiolist[index].album)+" "+getDuration(audiolist[index].duration)}
        </p>
      </div>
      <hr className={css.divider}></hr>
      </>
    );
  };
  audiolist = audiolist || [];
  return audiolist.length === 0 ? (
    <strong>Connected device does not contain any audio files</strong>
  ) : (
    <VirtualGridList
      direction="vertical"
      dataSize={audiolist.length}
      itemRenderer={renderItem}
      itemSize={{
        minWidth: ri.scale(3000),
        minHeight: ri.scale(300),
      }}
    />
  );
};

audioList.propTypes = {
  handleNavigate: PropTypes.func.isRequired,
  audioList: PropTypes.array,
};

audioList.default = {
  audioList: [],
};

export default audioList;
