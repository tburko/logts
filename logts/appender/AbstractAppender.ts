import Level from '../Level';
import Logger from '../Logger';

import AppenderConfig from '../config/AppenderConfig';

import Appender from './Appender';

export abstract class AbstractAppender implements Appender {
	private _config: AppenderConfig = null;
	private _level: Level = null;

	getLevel(): Level {
		return this._level;
	}

	setLevel(level: Level): void {
		this._level = level;
	}

	append(logger: Logger, level: Level, args: IArguments): void {
		if (level < this._level) {
			return;
		}

		this._doAppend(logger, level, args);
	}

	configure(config: AppenderConfig): void {
		this._config = config;

		this.setLevel(config.level);
		this._setOptions(config.options);
	}

	protected abstract _doAppend(logger: Logger, level: Level, args: IArguments): void;

	protected _setOptions(options: Object): void {
		// override to add support for custom options in subclasses
	};
}

export default AbstractAppender;

