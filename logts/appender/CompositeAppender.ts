import Level from '../Level';
import Logger from '../Logger';

import AbstractAppender from './AbstractAppender';
import Appender from './Appender';

export default class CompositeAppender extends AbstractAppender {
	private _appenders: Appender[] = [];

	constructor() {
		super();

		// just forward all entries
		this.setLevel(Level.ALL);
	}

	add(appender: Appender): void {
		this._appenders.push(appender);
	}

	remove(appender: Appender): void {
		this._appenders = this._appenders.filter(a => a !== appender);
	}

	protected _doAppend(logger: Logger, level: Level, args: IArguments): void {
		for (let i = 0; i < this._appenders.length; i++) {
			this._appenders[i].append(logger, level, args);
		}
	}
}

