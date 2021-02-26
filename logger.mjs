// Fatal Error handler
import kleur from 'kleur';
import symbols from './symbols.mjs';

const prelog = () => {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
};

export const fatal = err => {
	prelog();
	console.error(
		`${symbols.cross} ${kleur.bold(err || 'No Error message')} ${kleur.gray(
			'(Exiting in 1s)'
		)}`
	);
	return setTimeout(() => {
		process.exit(1);
	}, 1000); // keepAlive
};

export const success = (message, message2) => {
	prelog();
	console.log(
		`${symbols.check} ${kleur.bold(message || 'No Message Specified')}${
			message2 ? ` ${kleur.gray(`(${message2})`)}` : ''
		}`
	);
};
