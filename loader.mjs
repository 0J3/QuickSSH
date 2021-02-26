import kleur from 'kleur';

let loaderText = '';
let loaderText2 = '';
let loaderSymb = 0;
let loaders = ['⠁', '⠂', '⠄', '⠠', '⠐', '⠈'];
let loaderOn = false;

let destroyed = false;

const interval = setInterval(() => {
	if (loaderOn) {
		loaderSymb = loaderSymb + 1;
		if (!loaders[loaderSymb]) {
			loaderSymb = 0;
		}
		process.stdout.cursorTo(0);
		process.stdout.clearLine();
		process.stdout.write(
			`${loaders[loaderSymb]} ${kleur.bold(loaderText)}${kleur.gray(
				loaderText2 || ''
			)}`
		);
	}
}, 50);

const check = () => {
	if (destroyed) {
		throw new Error('Attempted to call loader after destruction');
	}
};

export default {
	setLoaders: list => {
		check();
		loaders = list;
	},
	setLoaderText: (text, text2) => {
		check();
		loaderText = text;
		if (text2) loaderText2 = ` (${text2})`;
	},
	enableLoader: () => {
		check();
		loaderOn = true;
	},
	disableLoader: () => {
		check();
		loaderOn = false;
	},
	destroy: () => {
		check();
		clearInterval(interval);
		destroyed = true;
	},
};
