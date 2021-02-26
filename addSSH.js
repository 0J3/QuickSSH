import prompts from 'prompts';
import { success, fatal } from './logger.mjs';

const labels = {
	ip: /*chalk.rgb(255, 0, 255)*/ 'Enter your SSH login (User@IP):',
	port: /*chalk.rgb(122, 0, 255)*/ 'Enter your SSH port [22]:',
	command:
		/*chalk.rgb(122, 0, 255)*/ 'Enter a command to run after connecting [/bin/bash]:',
};

(async () => {
	let { ip, port, command } = await prompts([
		{
			type: 'text',
			name: 'ip',
			message: labels.ip,
		},
		{
			type: 'number',
			name: 'port',
			message: labels.port,
		},
		{
			type: 'text',
			name: 'command',
			message: labels.command,
		},
	]);
	if (!ip) {
		return fatal('IP Missing');
	}
	port = port || 22;
	command =
		command && command != '' && command.trim && command.trim() != ''
			? command
			: '/bin/bash';

	success('Got SSH Command', `ssh ${ip} -p ${port} -t "${command}"`);
})();
