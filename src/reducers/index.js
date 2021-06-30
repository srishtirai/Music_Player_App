import path from "./navigationReducer";
import audioListReducer from "./audioReducer";
import deviceReducer from "./deviceReducer";
import BTStatus from './BTStatus';
import adapterStatus from './adapterStatus';
import avrcpConnectionStatus from "./avrcpConnectionStatus";
import playerInfo from "./playerInfo";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  path: path,
  device: deviceReducer,
  audio: audioListReducer,
  BTStatus,
  adapterStatus,
  avrcpConnectionStatus,
  playerInfo
});
export default rootReducer;
