import logts, { Logger } from '../logts';

const historyLogger = logts.getLogger('history');

for (let i = 0; i < 10; i++) {
	historyLogger.debug('step', i);
}

logts.getHistory().forEach((entry, index) => {
	const logger = entry[0]; // historyLogger
	const level = entry[1]; // Level.DEBUG
	const args = entry[3]; // ['step', index]
});
