import path from "./navigationReducer";
import BTStatus from './BTStatus';
import adapterStatus from './adapterStatus';
import avrcpConnectionStatus from "./avrcpConnectionStatus";
import playerInfo from "./playerInfo";
import folderItems from "./folderItems";
import noOfFolderItems from "./numberOfFolderItems";
import folderPath from "./folderPath";
import selectedMusic from "./selectedMusic";
import selectedMusicStatus from "./playStatus";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  path: path,
  selectedMusic,
  BTStatus,
  adapterStatus,
  avrcpConnectionStatus,
  playerInfo,
  folderItems,
  noOfFolderItems,
  selectedMusicStatus,
  folderPath
});
export default rootReducer;
