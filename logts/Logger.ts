import Appender from './appender/Appender';
import Level from './Level';

export class Logger {
	private _level: Level = null;

	constructor(
		private _name: string,
		private _parent: Logger,
		private _appender: Appender
	) {}

	trace(...args: any[]): void {
		this._logAt(Level.TRACE, arguments);
	}

	debug(...args: any[]): void {
		this._logAt(Level.DEBUG, arguments);
	}

	log(...args: any[]): void {
		this._logAt(Level.LOG, arguments);
	}

	info(...args: any[]): void {
		this._logAt(Level.INFO, arguments);
	}

	warn(...args: any[]): void {
		this._logAt(Level.WARN, arguments);
	}

	error(...args: any[]): void {
		this._logAt(Level.ERROR, arguments);
	}

	getAppender(): Appender {
		return this._appender;
	}

	getEffectiveLevel(): Level {
		if (this._level !== null) {
			return this._level;
		} else if (this._parent !== null) {
			return this._parent.getEffectiveLevel();
		} else {
			return Level.ALL;
		}
	}

	getLevel(): Level {
		return this._level;
	}

	setLevel(level: Level): void {
		this._level = level;
	}

	getName(): string {
		return this._name;
	}

	getParent(): Logger {
		return this._parent;
	}

	isLevelEnabled(level: Level): boolean {
		return level >= this.getEffectiveLevel();
	}

	private _logAt(level: Level, args: IArguments): void {
		if (this.isLevelEnabled(level)) {
			this._appender.append(this, level, args);
		}
	}
}

export default Logger;
