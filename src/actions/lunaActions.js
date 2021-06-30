import LS2RequestSingleton from '../utils/LS2RequestSingleton';

const lunaAction = ({service, method, parameters, resolve, name}, parser) => {
	const r = LS2RequestSingleton(name);
	if (r) {
		r.send({
			service: service,
			method: method,
			parameters: parameters || {},
			onComplete: (res) => {
				parser(res);
			}
		});
	} else if (resolve) {
		resolve(true);
	}
};

export default lunaAction;
