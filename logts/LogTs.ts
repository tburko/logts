import Appender from './appender/Appender';
import CompositeAppender from './appender/CompositeAppender';
import ConsoleAppender from './appender/ConsoleAppender';
import { HistoryAppender, HistoryEntry } from './appender/HistoryAppender';

import AppenderConfig from './config/AppenderConfig';
import LogTsConfig from './config/LogTsConfig';
import LogTsConfigJson from './config/json/LogTsConfigJson';
import * as JsonFormat from './config/json/JsonFormat';

import Level from './Level';
import Logger from './Logger';

export class LogTs {
	private _appenders: {[name: string]: Appender} = {};
	private _compositeAppender = new CompositeAppender();
	private _config: LogTsConfig = null;
	private _consoleAppender = new ConsoleAppender();
	private _historyAppender = new HistoryAppender();
	private _loggerNameSeparator = '/';
	private _loggers: {[name: string]: Logger} = {};
	private _root = new Logger('', null, this._compositeAppender);

	constructor() {
		this._configure(this._createDefaultConfig());
		this.registerAppender('console', this._consoleAppender);
		this.registerAppender('history', this._historyAppender);
	}

	configure(json: LogTsConfigJson): void {
		this._configure(JsonFormat.read(json));
	}

	getHistory(): HistoryEntry[] {
		return this._historyAppender.getHistory();
	}

	getLogger(name: string): Logger {
		return this._loggers[name] || this._createLogger(name);
	}

	registerAppender(name: string, appender: Appender): void {
		if (this._appenders[name]) {
			throw new Error('Duplicate appender name: ' + name);
		}

		this._configureAppender(name, appender);
		this._compositeAppender.add(appender);
		this._appenders[name] = appender;
	}

	unregisterAppender(name: string): Appender {
		const appender = this._appenders[name];
		if (!appender) {
			throw new Error('No appender under the name: ' +  name);
		}

		this._compositeAppender.remove(appender);
		delete this._appenders[name];

		return appender;
	}

	private _configure(config: LogTsConfig): void {
		this._config = this._createDefaultConfig().merge(config);

		for (const name in this._appenders) {
			this._configureAppender(name, this._appenders[name]);
		}

		for (const name in this._loggers) {
			this._configureLogger(this.getLogger(name));
		}

		for (const name in this._config.loggers) {
			this._configureLogger(this.getLogger(name));
		}

		this._root.setLevel(this._config.root);
	}

	private _configureAppender(name: string, appender: Appender): void {
		appender.configure(this._getAppenderConfig(name));
	}

	private _configureLogger(logger: Logger): void {
		logger.setLevel(this._config.loggers[logger.getName()] || null);
	}

	private _createDefaultConfig(): LogTsConfig {
		return new LogTsConfig();
	}

	private _createLogger(name: string): Logger {
		if (this._loggers[name]) {
			throw new Error('Logger already exists: ' + name);
		}
		
		const parent = this._getParentLogger(name);
		const appender = this._compositeAppender;

		const logger = new Logger(name, parent, appender);
		this._configureLogger(logger);
		this._loggers[name] = logger;

		return logger;
	}

	private _getAppenderConfig(name: string): AppenderConfig {
		return this._config.appenders[name] || new AppenderConfig();
	}

	private _getParentLogger(childName: string): Logger {
		const parentName = this._getParentLoggerName(childName);

		return parentName ? this.getLogger(parentName) : this._root;
	}

	private _getParentLoggerName(childName: string): string {
		const path = childName.split(this._loggerNameSeparator);
		path.pop();

		if (path.length === 0) {
			return null;
		}

		return path.join(this._loggerNameSeparator);
	}
}

export default LogTs;
