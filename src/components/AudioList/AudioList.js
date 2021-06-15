import React from "react";
import PropTypes from "prop-types";
import ImageItem from "../../../goldstone/ImageItem";
import { VirtualGridList } from "../../../goldstone/VirtualList/VirtualList";
import ri from "@enact/ui/resolution";
import placeHolderImg from "../../../assets/images/defaultmusic.jpg";
import { getEncodedPath } from "../../components/AudioPlayer/AudioPlayerBase/util";

const audioList = ({ audiolist, handleNavigate }) => {
  const renderItem = ({ index, ...rest }) => {
    let encodedPath = getEncodedPath(audiolist[index].thumbnail);

    return (
      <ImageItem
        {...rest}
        src={encodedPath}
        placeholder={placeHolderImg}
        onClick={() => handleNavigate("/audioplayer", audiolist[index], index)}
      >
        {audiolist[index].title}
      </ImageItem>
    );
  };
  audiolist = audiolist || [];
  return audiolist.length === 0 ? (
    <h3>Audio fodler does not exist in storage device</h3>
  ) : (
    <VirtualGridList
      direction="vertical"
      dataSize={audiolist.length}
      itemRenderer={renderItem}
      itemSize={{
        minWidth: ri.scale(500),
        minHeight: ri.scale(500),
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
