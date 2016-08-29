/**
 * Deep clone an object. All members have to be JSON-serializable.
 */
export function clone(object: Object): Object {
	try {
		return JSON.parse(JSON.stringify(object));
	} catch (e) {
		throw new Error('Failed to clone an object: ' + e.message);
	}
};

export function merge(target: Object, source: Object): void {
	for (const propName in source) {
		target[propName] = source[propName];
	}
};
