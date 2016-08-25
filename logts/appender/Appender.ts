import Level from '../Level';
import Logger from '../Logger';

import AppenderConfig from '../config/AppenderConfig';

export interface Appender {
	append(logger: Logger, level: Level, args: IArguments): void;
	configure(config: AppenderConfig): void;
	getLevel(): Level;
	setLevel(level: Level): void;
}

export default Appender;
