import { assert } from 'chai';

import Level from '../../logts/Level';

import AppenderConfig from '../../logts/config/AppenderConfig';
import LogTsConfig from '../../logts/config/LogTsConfig';

describe('LogTsConfig', () => {
	let config: LogTsConfig = null;

	it('constructor: appenders initialized to empty object', () => {
		assert.deepEqual(new LogTsConfig().appenders, {});
	});

	it('constructor: loggers initialized to empty object', () => {
		assert.deepEqual(new LogTsConfig().loggers, {});
	});

	it('constructor: root initialized to Level.ALL', () => {
		assert.deepEqual(new LogTsConfig().root, Level.ALL);
	});

	it('merge(): uses new root', () => {
		const a = new LogTsConfig();
		const b = new LogTsConfig();

		a.root = Level.DEBUG;
		b.root = Level.ERROR;
		assert.notStrictEqual(a.root, b.root);

		a.merge(b);
		assert.strictEqual(a.root, b.root);
	});

	it('merge(): adds cloned appender configs for new keys', () => {
		const a = new LogTsConfig();
		const b = new LogTsConfig();

		const ac1 = new AppenderConfig();
		const ac1clone = <any>'ac1 clone';
		ac1.clone = () => ac1clone;

		const ac2 = new AppenderConfig();
		const ac2clone = <any>'ac2 clone';
		ac2.clone = () => ac2clone;

		b.appenders['ac1'] = ac1;
		b.appenders['ac2'] = ac2;

		a.merge(b);

		assert.deepEqual(a.appenders, {ac1: ac1clone, ac2: ac2clone});
	});

	it('merge(): merges appender configs for existing keys', () => {
		const a = new LogTsConfig();
		const b = new LogTsConfig();

		const ac1a = new AppenderConfig();
		let ac1aMergeArg: AppenderConfig = null;
		ac1a.merge = (ac) => {
			ac1aMergeArg = ac;
		};

		const ac2a = new AppenderConfig();
		let ac2aMergeArg: AppenderConfig = null;
		ac2a.merge = (ac) => {
			ac2aMergeArg = ac;
		};

		a.appenders['ac1'] = ac1a;
		a.appenders['ac2'] = ac2a;

		const ac1b = new AppenderConfig();
		const ac2b = new AppenderConfig();
		b.appenders['ac1'] = ac1b;
		b.appenders['ac2'] = ac2b;

		a.merge(b);

		assert.deepEqual(a.appenders, {ac1: ac1a, ac2: ac2a});
		assert.strictEqual(ac1aMergeArg, ac1b);
		assert.strictEqual(ac2aMergeArg, ac2b);
	});

	it('merge(): existing loggers retained, new added', () => {
		const a = new LogTsConfig();
		const b = new LogTsConfig();

		const l1 = <any>'l1';
		const l2a = <any>'l2a';
		const l2b = <any>'l2b';
		const l3 = <any>'l3';

		a.loggers['l1'] = l1;
		a.loggers['l2'] = l2a;

		b.loggers['l2'] = l2b;
		b.loggers['l3'] = l3;

		a.merge(b);

		assert.deepEqual(a.loggers, {l1: l1, l2: l2b, l3: l3});
	});
});
