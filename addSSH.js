import fs from 'fs-extra';
import yml from 'node-yaml';
import { resolve } from 'path';
import prompts from 'prompts';
import semver from 'semver';
import loader from './loader.mjs';
import { success, fatal } from './logger.mjs';
import upgrade from './configVersionUpgrader.mjs';
import cmdify from 'cmdify';
import checkIntegrity from './configIntegrityCheck.mjs';

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
			validate: value => {
				let a = value && value != '';
				return a;
			},
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

	loader.setLoaderText('Ensuring Config Exists');
	loader.enableLoader();

	const dataPath = `${resolve('.')}/list.yml`;

	const packageJson = JSON.parse(fs.readFileSync('./package.json'));

	const version = packageJson.version;

	const parsedVersion = semver.parse(version);

	let data = {
		version: version,
		data: [],
	};

	if (fs.existsSync(dataPath)) {
		loader.setLoaderText('Found Config. Loading Config!');
		data = await yml.readSync(dataPath);

		if (
			!checkIntegrity(data, () => {
				try {
					loader.destroy();
				} catch (error) {}
			})
		)
			return;

		const oldParsedVersion = semver.parse(data.version);

		const compared = parsedVersion.compare(oldParsedVersion);

		if (compared == -1) {
			return fatal(
				'Cannot downgrade version! Please remove your list.yml or upgrade QuickSSH'
			);
		} else if (compared == 1) {
			success('Version Upgrade Detected! Running Config Upgrader...');
			loader.setLoaderText('Upgrading Config...', 'Please be patient...');
			data = await upgrade(data, oldParsedVersion, parsedVersion);
		} else {
			success('Loaded Config!', 'Version Matched - No need to upgrade!');
		}
	} else {
		loader.setLoaderText('Config not found. Creating Default Config!');
		yml.writeSync(dataPath, data);
		success('Config Created!');
	}
	success('Target Reached: Config Loaded!');
	loader.setLoaderText('Adding Entry to Config...');

	data.data[data.data.length] = {
		command: /*cmdify*/ `ssh ${ip} -p ${port} -t "${command}"`,
		label: `${ip} > ${command}`,
		ip,
		port,
		postConnect: command,
	};
	success(`Added Entry`);

	loader.setLoaderText('Writing to Config...');
	yml.writeSync(dataPath, data);

	success(`Wrote to file!`);
	loader.setLoaderText('Ensuring Integrety of Config...');
	if (
		!checkIntegrity(yml.readSync(dataPath), () => {
			try {
				loader.destroy();
			} catch (error) {}
		})
	)
		return;

	loader.destroy();
	success('Target Reached: Finish!');
})();
