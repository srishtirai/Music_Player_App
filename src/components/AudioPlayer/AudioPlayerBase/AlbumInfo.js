import React from "react";
import placeHolderImg from "../../../../assets/images/defaultmusic.jpg";
import Times from "./Times";
import css from "./AlbumInfo.module.less";
import { getEncodedPath } from "./util";
import { memoize } from "@enact/core/util";
import DurationFmt from "ilib/lib/DurationFmt";

function AlbumInfo({ duration, currentTime, title, artist, album, locale, thumbnail}) {
  let imgSrc =
    thumbnail && thumbnail.length > 0
      ? getEncodedPath(thumbnail)
      : placeHolderImg;

  const memoGetDurFmt = memoize(
  (/* locale */) =>
    new DurationFmt({
      length: "medium",
      style: "clock",
      useNative: false,
    })
  );

  const getDurFmt = (locale) => {
    if (typeof window === "undefined") return null;

    return memoGetDurFmt(locale);
  };

  const durFmt = getDurFmt(locale);

  return (
    <div className={css.album}>
        <img className={css.albumimage} src={imgSrc} />
        <div className={css.info}>
          <marquee className={css.title}>
            <p>{title}</p>
          </marquee>
          <p className={css.subtitle}>{artist?artist:'Artist information is not available'}</p>
          <p className={css.albumName}>{album?album:'Album information is not available'}</p>
          <div className={css.timeInfo}>
          <Times
            noTotalTime
            current={currentTime}
            formatter={durFmt}
          />
          <Times
            noCurrentTime
            total={duration}
            formatter={durFmt}
          />  
          </div>       
        </div>
    </div>
  );
}

export default React.memo(AlbumInfo);
