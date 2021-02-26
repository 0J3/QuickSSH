// Fatal Error handler
import kleur from 'kleur';
import symbols from './symbols.mjs';

export const fatal = err => {
	console.error(
		`${symbols.cross} ${kleur.bold(err || 'No Error message')} ${kleur.gray(
			'(Exiting in 500ms)'
		)}`
	);
	return setTimeout(() => {
		process.exit(1);
	}, 500); // keepAlive
};

export const success = (message, message2) => {
	console.log(
		`${symbols.check} ${kleur.bold(message || 'No Message Specified')}${
			message2 ? ` ${kleur.gray(`(${message2})`)}` : ''
		}`
	);
};
