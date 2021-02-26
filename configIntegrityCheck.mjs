import { fatal } from './logger.mjs';

const requiredProprieties = ['version', 'data'];
const requiredDataProprieties = ['command', 'label'];

export default (data, errorCallback) => {
	if (!errorCallback) {
		errorCallback = () => {};
	}
	if (!data) {
		errorCallback();
		return;
	}

	let errored = false;
	requiredProprieties.forEach(prop => {
		if (errored == true) return false;

		if (!data[prop]) {
			fatal(
				`Corrupted Config Detected! Please delete list.yml and try again. (Config does not have propriety '${prop}')`
			);
			errored = true;
			return;
		}
	});
	if (errored == true) return errorCallback() && false;

	data.data.forEach((d, i) => {
		requiredDataProprieties.forEach(requiredProp => {
			if (errored == true) return false;

			if (!d) {
				fatal(
					`Corrupted Config Detected! Please delete list.yml and try again. (Empty Key data>${i})`
				);
				errored = true;
				return;
			}

			if (!d[requiredProp]) {
				fatal(
					`Corrupted Config Detected! Please delete list.yml and try again. (Config does not have propriety '${prop}' in data>${i})`
				);
				errored = true;
				return;
			}
		});
	});
	if (errored == true) return errorCallback() && false;

	return !errored;
};
