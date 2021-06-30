/**
 * getting value on nested object
 * @param {object} obj object
 * @param {string} path path key ex) 'root.parent.chiled'
 */
const _get = (obj, path) => {
	// eslint-disable-next-line
	if (path === '' || path === undefined) return obj;

	if (typeof path === 'string') path = path.split('.');
	return path.reduce((obj2, level) => obj2 && obj2[level], obj);
};

const _getState = (path = '') => (obj) => _get(obj, path);

const _update2 = (obj, path, value, force = false) => {
	if (typeof path === 'string') path = path.split('.');
	// console.log('-- _update - path', path);

	// eslint-disable-next-line
	if (force && obj[path[0]] === undefined) {
		// console.log('======== ',obj, path[0]);
		let newObj = {};
		obj[path[0]] = newObj;
	}

	if (path.length === 1) {
		// eslint-disable-next-line
		if (obj === undefined) {
			// eslint-disable-next-line
			console.error('_update - key not found');
			return;
		}

		obj[path] = value;
		return;
	}
	// console.log('----',obj,'['+path[0]+']=',value, force);
	return _update2(obj[path[0]], path.slice(1), value, force);
};

/**
 * update nested key
 * @param {object} obj object
 * @param {string} path path key ex) 'root.parent.chiled'
 * @param {string} value
 * @param {bool} force if path is not exist, create path (default: false)
 */
const _update = (obj, path, value, force = false) => {
	_update2(obj, path, value, force);
	obj = Object.assign({}, obj);
};

export {
	_get,
	_getState,
	_update
};
