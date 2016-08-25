import AppenderConfigJson from './AppenderConfigJson';

export interface LogTsConfigJson {
	appenders?: {[name: string]: AppenderConfigJson};
	loggers?: {[name: string]: string};
	root?: string;
}

export default LogTsConfigJson;
