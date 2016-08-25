export function clone<T>(object: T): T {
	return JSON.parse(JSON.stringify(object));
};

export function merge<T>(target: T, source: T): void {
	for (const propName in source) {
		target[propName] = source[propName];
	}
};
