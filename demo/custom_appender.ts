import {
	AbstractAppender,
	Level,
	Logger,
	logts
} from '../logts';

import DomAppender from './DomAppender';

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

const logger = logts.getLogger('appender');

logger.trace('trace statement');
logger.debug('debug statement');
logger.log('log statement');
logger.info('info statement');
logger.warn('warn statement');
logger.error('error statement');


// let total = 0;
// let i = 0;
// for (; i < 10; i++) {
// 	const start = window.performance.now();
// 	const count = 1e5;
// 	for (let i = 0; i < count; i++) {
// 		log.trace(i);
// 	}
// 	const time = window.performance.now() - start;
// 	log.info('took', time, 'ms to log', count, 'entries at trace level');

// 	total += time;
// }

// log.info('total:', total, 'average:', Math.round(total / i));
