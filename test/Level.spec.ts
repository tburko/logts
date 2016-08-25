import { assert } from 'chai';

import { Level } from '../logts';

describe('Level', function() {
	const name = 'test name';
	const severity = 42;
	const level = new Level(name, severity);

	it('getName(): returns name', () => {
		assert.equal(level.getName(), name);
	});

	it('getSeverity(): returns severity', () => {
		assert.equal(level.getSeverity(), severity);
	});

	it('toString(): returns name', () => {
		assert.equal(level.toString(), level.getName());
	});

	it('valueOf(): returns severity', () => {
		assert.equal(level.valueOf(), level.getSeverity());
	});

	it('arithmetic operations: uses severity value', () => {
		assert.equal(<any>level, level.getSeverity());
		assert.equal(<any>level + 1, level.getSeverity() + 1);
		assert.isBelow(<any>level, level.getSeverity() + 1);
		assert.isAbove(<any>level, level.getSeverity() - 1);
	});

	it('constants: severity increases with level', () => {
		const levels = [
			Level.ALL,
			Level.TRACE,
			Level.DEBUG,
			Level.LOG,
			Level.INFO,
			Level.WARN,
			Level.ERROR,
			Level.OFF
		];

		let lastLevel: Level = null;
		levels.forEach((level, index) => {
			if (lastLevel !== null) {
				assert.isTrue(level > lastLevel, `level ${index} > ${index - 1}`);
			}

			lastLevel = level;
		});
	});

	it('fromName(): throws if name not found', () => {
		assert.throws(() => Level.fromName(undefined));
		assert.throws(() => Level.fromName(null));
		assert.throws(() => Level.fromName(<any>0));
		assert.throws(() => Level.fromName('__proto__'));
		assert.throws(() => Level.fromName('fromName'));
		assert.throws(() => Level.fromName('BLAH'));
	});

	it('fromName(): returns correct values', () => {
		assert.strictEqual(Level.ALL, Level.fromName('ALL'));
		assert.strictEqual(Level.TRACE, Level.fromName('TRACE'));
		assert.strictEqual(Level.DEBUG, Level.fromName('DEBUG'));
		assert.strictEqual(Level.LOG, Level.fromName('LOG'));
		assert.strictEqual(Level.INFO, Level.fromName('INFO'));
		assert.strictEqual(Level.WARN, Level.fromName('WARN'));
		assert.strictEqual(Level.ERROR, Level.fromName('ERROR'));
		assert.strictEqual(Level.OFF, Level.fromName('OFF'));
	});

	it('fromName(): case-sensitive', () => {
		assert.throws(() => Level.fromName('debug'));
		assert.strictEqual(Level.DEBUG, Level.fromName('DEBUG'));
	});
});
