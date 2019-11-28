import { RateLimit } from './rateLimit';
interface LoggerOptions {
    sampleRate?: number;
    samplePeriod?: number;
    [key: string]: string | number | undefined;
}
export declare class Logger {
    protected options: LoggerOptions;
    protected counter: number;
    protected limiter: RateLimit;
    disabled: boolean;
    logger: Console;
    verboseLoggerStream: any;
    constructor(options?: LoggerOptions);
    setLoggerClass(logger: any): void;
    setDisabled(disabled: boolean): void;
    _limitedLogInfo(): void;
    _stringifyOptions(): string;
    log(...args: any[]): void;
    info(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    sample(data: any, arg2?: any): void;
    destroy(): void;
}
export {};
