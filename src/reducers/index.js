import path from "./navigationReducer";
import audioListReducer from "./audioReducer";
import deviceReducer from "./deviceReducer";
import BTStatus from './BTStatus';
import adapterStatus from './adapterStatus';
import avrcpConnectionStatus from "./avrcpConnectionStatus";
import playerInfo from "./playerInfo";
import folderItems from "./folderItems";
import noOfFolderItems from "./numberOfFolderItems";
import folderPath from "./folderPath";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  path: path,
  device: deviceReducer,
  audio: audioListReducer,
  BTStatus,
  adapterStatus,
  avrcpConnectionStatus,
  playerInfo,
  folderItems,
  noOfFolderItems,
  folderPath
});
export default rootReducer;
