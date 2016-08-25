import {
	AbstractAppender,
	Level,
	Logger
} from '../logts';

export class DomAppender extends AbstractAppender {
	private _className: string = null;

	constructor(
		private _containerEl: HTMLElement
	) {
		super();
	}

	protected _doAppend(logger: Logger, level: Level, args: IArguments): void {
		const el = this._createElement(logger, level, args);
		this._containerEl.appendChild(el);
	}

	protected _setOptions(options: Object): void {
		this._className = options['className'];
	}

	private _createElement(logger: Logger, level: Level, args: IArguments): HTMLElement {
		const el = document.createElement('div');
		el.className = this._className + ' ' + level.getName();

		const nameEl = document.createElement('span');
		nameEl.textContent = logger.getName();
		nameEl.className = 'name';
		el.appendChild(nameEl);

		const textEl = document.createElement('span');
		textEl.textContent = Array.prototype.join.call(args, ' ');
		textEl.className = 'text';
		el.appendChild(textEl);

		return el;
	}
}

export default DomAppender;
