import Level from '../Level';
import Logger from '../Logger';

import AppenderConfig from '../config/AppenderConfig';

import AbstractAppender from './AbstractAppender';

export type HistoryEntry = [Logger, Level, any[]];

export class HistoryAppender extends AbstractAppender {
	private _defaultDepth = 1024;
	private _depth: number = null;
	private _history: HistoryEntry[] = null;
	private _index: number = null;

	getHistory(): HistoryEntry[] {
		// This is a bit tricky since the history array wraps around.
		// Collect the older entries first (index..length), then the newer ones (0..index).
		// Undefined entries should be dropped as they may not have been written to yet.

		return this._history
			.filter((entry, index) => index >= this._index)
			.concat(this._history.filter((entry, index) => index < this._index))
			.filter(entry => entry !== undefined);
	}

	setDepth(depth: number): void {
		this._depth = depth;
		this._history = new Array(depth);
		this._index = 0;
	}

	protected _doAppend(logger: Logger, level: Level, args: IArguments): void {
		// suppress type check with <any> here until compiler can figure it out
		this._history[this._index++] = <any>arguments;

		// wrap around to save on allocation and GC
		// less expensive at append time, but more expensive to get history
		if (this._index >= this._depth) {
			this._index = 0;
		}
	}

	protected _setOptions(options: Object): void {
		let depth = this._defaultDepth;

		if (options.hasOwnProperty('depth')) {
			if (typeof options['depth'] !== 'number') {
				throw new Error('Invalid depth type');
			}

			depth = options['depth'];
		}

		this.setDepth(depth);
	}
}

export default HistoryAppender;
