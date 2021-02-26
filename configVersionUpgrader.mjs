const wait = ms => {
	return new Promise(res => {
		setTimeout(res, ms);
	});
};

export default async (config, oldVerson, newVersion) => {
	config.version = newVersion.version;
	await wait(500); // just to emulate time consuming shit - will be removed pre-1.0.0
	return config;
};
