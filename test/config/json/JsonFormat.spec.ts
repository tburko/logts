import { assert } from 'chai';

import Level from '../../../logts/Level';
import { read, readAppenderConfig } from '../../../logts/config/json/JsonFormat';

describe('JsonFormat', () => {
	it('read: empty object', () => {
		const config = read({});
		assert.deepEqual(config.appenders, {});
		assert.deepEqual(config.loggers, {});
		assert.strictEqual(config.root, Level.ALL);
	});

	it('read: root is converted from string to Level', () => {
		assert.strictEqual(read({root: 'DEBUG'}).root, Level.DEBUG);
	});

	it('read: passing invalid root level name throws', () => {
		assert.throws(() => read({root: 'WANR'}));
	});

	it('read: throws if loggers is present but is not an object', () => {
		assert.throws(() => read({loggers: null}));
		assert.throws(() => read({loggers: undefined}));
		assert.throws(() => read({loggers: <any>'DEBUG'}));
	});

	it('read: logger values are converted to Level', () => {
		const config = read({
			loggers: {
				a: 'DEBUG',
				b: 'INFO'
			}
		});
		assert.lengthOf(Object.keys(config.loggers), 2);
		assert.strictEqual(config.loggers['a'], Level.DEBUG);
		assert.strictEqual(config.loggers['b'], Level.INFO);
	});

	it('read: throws on invalid logger values', () => {
		assert.throws(() => read({
			loggers: {
				a: 'DEBU'
			}
		}));
	});

	it('read: throws if appenders is present but is not an object', () => {
		assert.throws(() => read({appenders: null}));
		assert.throws(() => read({appenders: undefined}));
		assert.throws(() => read({appenders: <any>'DEBUG'}));
	});

	it('read: throws if appender value is not an object or string', () => {
		assert.throws(() => read({appenders: {a: null}}));
		assert.throws(() => read({appenders: {a: undefined}}));
		assert.throws(() => read({appenders: {a: 12}}));
	});

	it('read: appender strings are converted to Level in level property', () => {
		const config = read({
			appenders: {
				a: 'TRACE',
				b: 'LOG',
				c: 'WARN'
			}
		});

		assert.lengthOf(Object.keys(config.appenders), 3);
		assert.strictEqual(config.appenders['a'].level, Level.TRACE);
		assert.strictEqual(config.appenders['b'].level, Level.LOG);
		assert.strictEqual(config.appenders['c'].level, Level.WARN);
	});

	it('read: appender level string is converted to Level', () => {
		const config = read({
			appenders: {
				a: {
					level: 'ERROR'
				}
			}
		});

		assert.lengthOf(Object.keys(config.appenders), 1);
		assert.strictEqual(config.appenders['a'].level, Level.ERROR);
	});

	it('read: appender options are copied', () => {
		const config = read({
			appenders: {
				a: {
					options: {
						meaning: 42
					}
				}
			}
		});

		assert.lengthOf(Object.keys(config.appenders), 1);
		assert.deepEqual(config.appenders['a'].options, {meaning: 42});
	});
});
