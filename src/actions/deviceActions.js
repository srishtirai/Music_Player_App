import { types } from "./types";
import { Device } from "../services";
import mockDeviceList from "../../assets/mock/deviceList.json";

const getDeviceListRequest = () => {
  return {
    type: types.FETCH_DEVICE_LIST_REQUEST,
  };
};

const setDeviceListSuccess = (deviceList) => {
  return {
    type: types.FETCH_DEVICE_LIST_SUCCESS,
    payload: deviceList,
  };
};

const setDeviceListError = (errMessage) => {
  return {
    type: types.FETCH_DEVICE_LIST_ERROR,
    payload: errMessage,
  };
};

const getDeviceList =
  ({ subscribe }) =>
  (dispatch) => {
    dispatch(getDeviceListRequest());
    /*
    if(!window.plam){
      dispatch(setDeviceListSuccess(mockDeviceList.pluginList));
    }
    else*/
    {
      Device.getDeviceList({
        subscribe: subscribe,
        onSuccess: (res) => {
          dispatch(setDeviceListSuccess(res.pluginList));
        },
        onFailure: (err) => {
          dispatch(setDeviceListSuccess(err.errorText));
        },
      });
    }
  };

const setCurrentDevice = (device) => {
  return {
    type: types.SET_CURRENT_DEVICE,
    payload: device,
  };
};

export {
  setCurrentDevice,
  getDeviceList,
  getDeviceListRequest,
  setDeviceListSuccess,
  setDeviceListError,
};
