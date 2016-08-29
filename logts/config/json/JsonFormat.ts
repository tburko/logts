import Level from '../../Level';

import AppenderConfig from '../AppenderConfig';
import LogTsConfig from '../LogTsConfig';

import AppenderConfigJson from './AppenderConfigJson';
import LogTsConfigJson from './LogTsConfigJson';

export function readAppenderConfig(input: AppenderConfigJson): AppenderConfig {
	let level: Level = null;
	let options: Object = null;

	if (typeof input === 'string') {
		level = Level.fromName(input);
	} else if (typeof input === 'object') {
		if (input.hasOwnProperty('options')) {
			options = input.options;
		}

		if (typeof input.level === 'string') {
			level = Level.fromName(input.level);
		}
	} else {
		throw new Error('Invalid appender config JSON value');
	}

	return new AppenderConfig(level, options);
};

export function read(json: LogTsConfigJson): LogTsConfig {
	const config = new LogTsConfig();

	if (json.hasOwnProperty('appenders')) {
		const appenders = json.appenders;

		if (!(typeof appenders === 'object' && appenders !== null)) {
			throw new Error('Invalid "appenders" type');
		}

		for (const name in appenders) {
			config.appenders[name] = readAppenderConfig(appenders[name]);
		}
	}

	if (json.hasOwnProperty('loggers')) {
		const loggers = json.loggers;

		if (!(typeof loggers === 'object' && loggers !== null)) {
			throw new Error('Invalid "loggers" type');
		}

		for (const name in loggers) {
			config.loggers[name] = Level.fromName(loggers[name]);
		}
	}

	if (json.hasOwnProperty('root')) {
		config.root = Level.fromName(json.root);
	}
	
	return config;
};
