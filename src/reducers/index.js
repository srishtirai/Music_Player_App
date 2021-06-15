import path from "./navigationReducer";
import audioListReducer from "./audioReducer";
import deviceReducer from "./deviceReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  path: path,
  device: deviceReducer,
  audio: audioListReducer,
});
export default rootReducer;
