[![Build Status](https://travis-ci.org/tburko/logts.svg?branch=master)](https://travis-ci.org/tburko/logts)
[![Coverage Status](https://coveralls.io/repos/github/tburko/logts/badge.svg?branch=master)](https://coveralls.io/github/tburko/logts?branch=master)
[![Dependencies](https://david-dm.org/tburko/logts.svg)](https://david-dm.org/tburko/logts)
[![Dev Dependencies](https://david-dm.org/tburko/logts/dev-status.svg)](https://david-dm.org/tburko/logts?type=dev)

# LogTs

TypeScript logger for browsers and Node.js.

## Basics

```typescript
import logts from 'logts';

// forward slash denotes hierarchy
const logger = logts.getLogger('examples/basics');

// showcasing levels
logger.trace('at trace');
logger.debug('at debug');
logger.log('at log');
logger.info('at info');
logger.warn('at warn');
logger.error('at error');

// pass multiple arguments
logger.debug('Meaning:', 42);
```

## Levels

```typescript
import Level from 'logts';

// set parent logger level
logts.getLogger('examples').setLevel(Level.WARN);

// now "examples/basics" logger inherits WARN level from it's parent
logger.getLevel() === null;
logger.getEffectiveLevel() === Level.WARN;

// set custom level
logger.setLevel(Level.DEBUG);
logger.getLevel() === Level.DEBUG;
logger.getEffectiveLevel() === Level.DEBUG;

// skip expensive operations
if (logger.isLevelEnabled(Level.DEBUG)) {
	logger.debug(reticulateSplines());
}
```

## Configuration

### Loggers

```typescript
logts.configure({
	loggers: {
		'examples': 'WARN',
		'examples/basics': 'DEBUG'
	},
	root: 'INFO'
});
```

### Appenders

```typescript
logts.configure({
	appenders: {
		'console': 'WARN',
		'history': {
			level: 'ALL',
			options: {
				depth: 10000
			}
		}
	},
	root: 'WARN'
});
```

### Disabling Appenders

```typescript
logts.unregisterAppender('console');
logts.unregisterAppender('history');
```

## Custom Appenders

```typescript
import { AbstractAppender, Level, Logger } from 'logts';

export class DomAppender extends AbstractAppender {
	private _className: string = null;

	constructor(
		private _containerEl: HTMLElement
	) {
		super();
	}

	/** @override */
	protected _doAppend(logger: Logger, level: Level, args: IArguments): void {
		const el = this._createElement(logger, level, args);
		this._containerEl.appendChild(el);
	}

	/** @override */
	protected _setOptions(options: Object): void {
		this._className = options['className'];
	}

	private _createElement(logger: Logger, level: Level, args: IArguments): HTMLElement {
		const el = document.createElement('div');
		el.className = this._className + ' ' + level.getName();

		const nameEl = document.createElement('span');
		nameEl.textContent = logger.getName();
		nameEl.className = 'name';
		el.appendChild(nameEl);

		const textEl = document.createElement('span');
		textEl.textContent = Array.prototype.join.call(args, ' ');
		textEl.className = 'text';
		el.appendChild(textEl);

		return el;
	}
}

const domAppender = new DomAppender(document.body);
logts.registerAppender('dom', domAppender);

logts.configure({
	appenders: {
		dom: {
			level: 'TRACE',
			options: {
				className: 'entry'
			}
		}
	}
});
```

## History

```typescript
logts.getHistory().forEach((entry, index) => {
	const logger = entry[0]; // logger instance
	const level = entry[1]; // Level
	const args = entry[3]; // method arguments
});
```

## License

MIT
