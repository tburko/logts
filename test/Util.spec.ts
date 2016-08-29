import { assert } from 'chai';

import { clone, merge } from '../logts/Util';

describe('Util', () => {
	it('clone', () => {
		function ok(o: Object, result: Object = o): void {
			assert.deepEqual(clone(o), result);
		};

		function fails(o: Object): void {
			assert.throws(() => clone(o));
		};

		ok(null);
		fails(undefined);
		ok(1);
		ok(NaN, null);
		ok(Number.MIN_VALUE);
		ok(-Number.MIN_VALUE);
		ok(Number.MAX_VALUE);
		ok(-Number.MAX_VALUE);
		ok(Number.POSITIVE_INFINITY, null);
		ok(Number.NEGATIVE_INFINITY, null);
		ok('');
		ok('Méllon');
		fails(() => {});
		ok({});
		ok({meaning: 42});
		ok({a: undefined}, {});
		ok({a: NaN}, {a: null});
		ok({a: Number.POSITIVE_INFINITY}, {a: null});
		ok({a: Number.NEGATIVE_INFINITY}, {a: null});
		ok({a: () => {}}, {});
		ok([]);
		ok([3, 1, 4]);
		ok([{meaning: 42}]);
	});

	it('merge', () => {
		function check(target: Object, source: Object, result: Object): void {
			merge(target, source);
			assert.deepEqual(target, result);
		};

		check({}, {}, {});
		check({}, {a: 0}, {a: 0});
		check({a: 0}, {}, {a: 0});
		check({a: 0}, {a: 1}, {a: 1});
		check({a: 0}, {b: 1}, {a: 0, b: 1});
		check({a: 0, b: 1, c: 2}, {b: 3}, {a: 0, b: 3, c: 2});
	});
});
