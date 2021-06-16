import React from "react";
import PropTypes from "prop-types";
import ImageItem from "../../../goldstone/ImageItem";
import { VirtualGridList } from "../../../goldstone/VirtualList/VirtualList";
import ri from "@enact/ui/resolution";
import placeHolderImg from "../../../assets/images/defaultmusic.jpg";
import { getEncodedPath } from "../../components/AudioPlayer/AudioPlayerBase/util";
import css from './AudioList.module.less';

const audioList = ({ audiolist, handleNavigate }) => {
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
      <strong className={css.title}  onClick={() => handleNavigate("/audioplayer", audiolist[index], index)}>{audiolist[index].title.replace('mp3','')}</strong>
      <hr className={css.divider}></hr></>
      // 
      // </div>
    );
  };
  audiolist = audiolist || [];
  return audiolist.length === 0 ? (
    <h1><strong>Connected device does not contain any audio items</strong></h1>
  ) : (
    <VirtualGridList
      direction="vertical"
      dataSize={audiolist.length}
      isVerticalScrollbarVisible = {true}
      overscrollEffectOn={{
        arrowKey: true,
        drag: true,
		pageKey: true,
		track: true,
		wheel: true
      }}
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
