import Level from '../Level';

import AppenderConfig from './AppenderConfig';

export class LogTsConfig {
	appenders: {[name: string]: AppenderConfig} = {};
	loggers: {[name: string]: Level} = {};
	root: Level = Level.ALL;

	merge(other: LogTsConfig): LogTsConfig {
		for (const name in other.appenders) {
			const myAppenderConfig = this.appenders[name];
			const otherAppenderConfig = other.appenders[name];

			if (!myAppenderConfig) {
				this.appenders[name] = otherAppenderConfig.clone();
			} else {
				myAppenderConfig.merge(otherAppenderConfig);
			}
		}

		for (const name in other.loggers) {
			this.loggers[name] = other.loggers[name];
		}

		this.root = other.root;

		return this;
	}
}

export default LogTsConfig;
