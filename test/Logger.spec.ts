import { assert } from 'chai';

import Appender from '../logts/appender/Appender';
import AppenderConfig from '../logts/config/AppenderConfig';
import Level from '../logts/Level';
import Logger from '../logts/Logger';

describe('Logger', () => {
	const levels: Level[] = [
		Level.ALL,
		Level.TRACE,
		Level.DEBUG,
		Level.LOG,
		Level.INFO,
		Level.WARN,
		Level.ERROR,
		Level.OFF
	];

	it('constructor: initializes name, parent and appender', () => {
		const name = <any>'name';
		const parent = <any>'parent';
		const appender = <any>'appender';

		const logger = new Logger(name, parent, appender);

		assert.strictEqual(logger.getName(), name);
		assert.strictEqual(logger.getParent(), parent);
		assert.strictEqual(logger.getAppender(), appender);
	});

	it('getEffectiveLevel(): returns Level.ALL if neither parent not level are set', () => {
		const logger = new Logger('logger', null, null);

		assert.strictEqual(logger.getEffectiveLevel(), Level.ALL);
	});

	it('getEffectiveLevel(): returns own level if set', () => {
		const logger = new Logger('logger', null, null);
		const level = <any>'logger level';
		logger.setLevel(level);

		assert.strictEqual(logger.getEffectiveLevel(), level);
	});

	it('getEffectiveLevel(): returns parent level if own level not set', () => {
		const parent = new Logger('parent', null, null);
		const parentLevel = <any>'parent level';
		parent.setLevel(parentLevel);

		const logger = new Logger('logger', parent, null);

		assert.strictEqual(logger.getEffectiveLevel(), parentLevel);
	});

	it('get/setLevel()', () => {
		const logger = new Logger('logger', null, null);
		assert.strictEqual(logger.getLevel(), null);

		const level = <any>'level';
		logger.setLevel(level);

		assert.strictEqual(logger.getLevel(), level);
	});

	it('isLevelEnabled(): true if severity is >= to own severity', () => {
		const logger = new Logger('logger', null, null);

		levels.forEach(loggerLevel => {
			logger.setLevel(loggerLevel);

			levels.forEach(checkLevel => {
				const actual = logger.isLevelEnabled(checkLevel);
				const expected = checkLevel.getSeverity() >= loggerLevel.getSeverity();
				assert.strictEqual(actual, expected);
			});
		});
	});

	it('isLevelEnabled(): true if severity >= to parent severity if level not set', () => {
		const parent = new Logger('parent', null, null);
		const logger = new Logger('logger', parent, null);

		levels.forEach(parentLevel => {
			parent.setLevel(parentLevel);

			levels.forEach(checkLevel => {
				const actual = logger.isLevelEnabled(checkLevel);
				const expected = checkLevel.getSeverity() >= parentLevel.getSeverity();
				assert.strictEqual(actual, expected);
			});
		});
	});

	it('isLevelEnabled(): all enabled if both parent and level not set', () => {
		const logger = new Logger('logger', null, null);

		levels.forEach(checkLevel => {
			assert.strictEqual(logger.isLevelEnabled(checkLevel), true);
		});
	});

	it('logging methods call appender with proper arguments', () => {
		type AppendArgs = {logger: Logger, level: Level, args: IArguments};

		// array allows catching multiple calls
		const actualAppendArgsList: AppendArgs[] = [];

		class AppenderMock implements Appender {
			append(logger: Logger, level: Level, args: IArguments): void {
				actualAppendArgsList.push({logger: logger, level: level, args: args});
			}
			configure(): void {}
			getLevel(): Level { return null; }
			setLevel(): void {}
		}

		const logger = new Logger('logger', null, new AppenderMock());
		// let all levels go through
		logger.setLevel(Level.ALL);

		[
			'trace',
			'debug',
			'log',
			'info',
			'warn',
			'error'
		].forEach(methodName => {
			const expectedLevel = Level.fromName(methodName.toUpperCase());

			const expectedLoggerArgs = ['a1', 'a2', 'a3', 'a4', 'a5'];
			logger[methodName].apply(logger, expectedLoggerArgs);

			assert.strictEqual(actualAppendArgsList.length, 1);

			const actualAppendArgs = actualAppendArgsList[0];
			const actualLogger = actualAppendArgs.logger;
			const actualLevel = actualAppendArgs.level;
			// convert IArguments to actual array
			const actualLoggerArgs = Array.prototype.slice.call(actualAppendArgs.args);

			assert.strictEqual(actualLogger, logger);
			assert.strictEqual(actualLevel, expectedLevel);
			assert.deepEqual(actualLoggerArgs, expectedLoggerArgs);

			actualAppendArgsList.length = 0;
		});
	});

	it('logging methods call appender only if level >= effective level', () => {

	});
});
