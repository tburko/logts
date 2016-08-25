export class Level {
	static ALL = new Level('ALL', -Number.MAX_VALUE);
	static TRACE = new Level('TRACE', 0);
	static DEBUG = new Level('DEBUG', 20);
	static LOG = new Level('LOG', 40);
	static INFO = new Level('INFO', 60);
	static WARN = new Level('WARN', 80);
	static ERROR = new Level('ERROR', 100);
	static OFF = new Level('OFF', Number.MAX_VALUE);

	static fromName(name: string) {
		const level = Level[name];

		if (level instanceof Level) {
			return level;
		}

		throw new Error('Unknown level name: ' + name);
	}

	constructor(
		private _name: string,
		private _severity: number
	) {}

	getName(): string {
		return this._name;
	}

	getSeverity(): number {
		return this._severity;
	}

	toString(): string {
		return this._name;
	}

	valueOf(): number {
		return this._severity;
	}
};

export default Level;
