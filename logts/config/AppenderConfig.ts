import Level from '../Level';
import { clone, merge } from '../util';

export class AppenderConfig {
	level: Level = Level.ALL;
	options: Object = {};

	constructor(
		level?: Level,
		options?: Object
	) {
		if (level) {
			this.level = level;
		}

		if (options) {
			this.options = options;
		}
	}

	clone(): AppenderConfig {
		const config = new AppenderConfig();

		config.level = this.level;
		config.options = clone(this.options);

		return config;
	}

	merge(other: AppenderConfig): void {
		this.level = other.level;
		merge(this.options, other.options);
	}
}

export default AppenderConfig;
