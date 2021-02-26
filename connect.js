import { success, fatal } from './logger.mjs';
import fs from 'fs-extra';
import yml from 'node-yaml';
import checkIntegrity from './configIntegrityCheck.mjs';
import upgrade from './configVersionUpgrader.mjs';
import { resolve } from 'path';
import semver from 'semver';
import prompts from 'prompts';
import { exec } from 'child_process';

process.title = 'QuickSSH > Connect';

const CMDCommand = process.platform == 'win32' ? 'start cmd /C' : '/bin/bash';
(async () => {
	const listLocation = resolve('list.yml');
	if (!fs.existsSync(listLocation)) {
		return fatal(`List doesn\'t exist. Please run add.sh/add.bat first!`);
	}

	success('Loading Config...');
	let config = yml.readSync(listLocation);

	if (!checkIntegrity(config)) return;

	const packageJson = JSON.parse(fs.readFileSync('./package.json'));

	const version = packageJson.version;

	const parsedVersion = semver.parse(version);

	const oldParsedVersion = semver.parse(config.version);

	const compared = parsedVersion.compare(oldParsedVersion);

	success('Running Version Checks...');

	if (compared == -1) {
		return fatal(
			'Cannot downgrade version(s)! Please remove your list.yml or upgrade QuickSSH'
		);
	} else if (compared == 1) {
		success('Version Upgrade Detected! Running Config Upgrader...');
		loader.setLoaderText('Upgrading Config...', 'Please be patient...');
		config = await upgrade(config, oldParsedVersion, parsedVersion);
		success('Writing Changes to Disk...');
		yml.writeSync(listLocation, config);
		success('Config Upgrade Finished!');
	} else {
		success('Loaded Config!', 'Version Matched - No need to upgrade!');
	}
	success('Target Reached: Config Loaded!');

	const choices = [];

	config.data.forEach(el => {
		choices[choices.length] = {
			title: el.label,
			value: el,
		};
	});

	const options = {
		type: 'multiselect',
		name: 'target',
		message: 'Select the Address(es) to connect to',
		hint:
			'Space/Left Arrow/Right Arrow to select. Return to submit. Up/Down arrows to navigate.',
		choices,
		min: 1,
		instructions: '',
		style: 'emoji',
	};

	let response = (await prompts(options)).target;

	if (!response) {
		return fatal('No Response Recieved. (Potential CTRL+C)');
	} else {
		success(
			`You may close this window/CTRL+C this command once the other one(s) has opened.`
		);
		response.forEach(item => {
			success(`Connecting to ${item.label}...`, item.command);
			exec(`${CMDCommand} ${item.command}`, (err, stdout, stderr) => {
				if (err) {
					fatal(
						`An error was encountered while running ${CMDCommand} ${item.command}.
err: ${err}
stdout: ${stdout}
stderr: ${stderr}`
					);
					return;
				}
				success('Target Reached: Finish!');
			});
		});
	}
})();
