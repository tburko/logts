import { Logger, logts } from '../logts';

logts.configure({
	appenders: {
		console: 'INFO'
	},
	loggers: {
		config: 'WARN',
		sub1: 'DEBUG'
	},
	root: 'DEBUG'
});

function testLevels(logger: Logger): void {
	logger.trace('trace');
	logger.debug('debug');
	logger.log('log');
	logger.info('info');
	logger.warn('warn');
	logger.error('error');
};

const logger = logts.getLogger('config');
testLevels(logger);

const sub1 = logts.getLogger('config/sub1');
testLevels(sub1)

const sub2 = logts.getLogger('config/sub2');
testLevels(sub2);
