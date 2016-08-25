import Level from '../Level';
import Logger from '../Logger';

import AbstractAppender from './AbstractAppender';

export default class ConsoleAppender extends AbstractAppender {
	private _methodNames: {[level: string]: string} = {};

	constructor() {
		super();

		// node console has no debug() method
		const debug = typeof console['debug'] === 'function' ? 'debug' : 'log';

		// debug() is correct, console.trace() is for (stack)traces
		this._setMethodName(Level.TRACE, debug);
		this._setMethodName(Level.DEBUG, debug);

		this._setMethodName(Level.LOG, 'log');
		this._setMethodName(Level.INFO, 'info');
		this._setMethodName(Level.WARN, 'warn');
		this._setMethodName(Level.ERROR, 'error');
	}

	private _getMethodName(level: Level): string {
		return this._methodNames[level.getName()] || 'log';
	}

	private _setMethodName(level: Level, name: string): void {
		if (typeof console[name] !== 'function') {
			throw new Error('Console method does not exist: ' + name);
		}

		this._methodNames[level.getName()] = name;
	}

	protected _doAppend(logger: Logger, level: Level, args: IArguments): void {
		const methodName = this._getMethodName(level);
		const loggerName = logger.getName();
		const text = Array.prototype.join.call(args, ' ');

		console[methodName]('%s: %s', loggerName, text);
	}
}

