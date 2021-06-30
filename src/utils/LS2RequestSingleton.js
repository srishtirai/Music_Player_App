import LS2Request from '@enact/webos/LS2Request';

const ls2instances = {};

const returnObj = (LsObj, skey) => {
	if (!skey) {
		return new LsObj();
	}

	if (ls2instances[skey]) {
		return false;
	}
	ls2instances[skey] = ls2instances[skey] || new LsObj();
	return ls2instances[skey];
};

let LS2RequestSingleton = (skey) => returnObj(LS2Request, skey);

export const cancelLS2Request = (name) => {
	if (ls2instances[name]) {
		ls2instances[name].cancel();
		ls2instances[name] = null;
		delete ls2instances[name];
	}
};

export default LS2RequestSingleton;
