import chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';
import { RateLimit } from './rateLimit';

const DEFAULT_SAMPLE_RATE = 2; // log x times every DEFAULT_SAMPLE_PERIOD seconds
const DEFAULT_SAMPLE_PERIOD = 5;

interface LoggerOptions {
  sampleRate?: number;
  samplePeriod?: number;
  [key: string]: string | number | undefined;
}
export class Logger {
  private options: LoggerOptions;
  private counter: number;
  private limiter: RateLimit;
  disabled: boolean = false;
  logger = console;
  verboseLoggerStream: any;

  constructor(options: any) {
    this.options = options || {};
    this.counter = 0;
    const rate = this.options.sampleRate || DEFAULT_SAMPLE_RATE;
    this.limiter = new RateLimit(rate, this.options.samplePeriod || DEFAULT_SAMPLE_PERIOD);
  }

  // replace console with custom logger
  setLoggerClass(logger: any) {
    this.logger = logger;
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  _limitedLogInfo() {
    this.info.apply(this, arguments as any);
  }

  _stringifyOptions() {
    let stringifyOptions: string = '';
    _.forOwn(this.options, (value, key) => {
      if (!_.includes(['sampleRate', 'samplePeriod'], key)) {
        stringifyOptions += `${key}=${value} `;
      }
    });
    return moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + stringifyOptions.substring(0, stringifyOptions.length - 1);
  }

  log(...args: any[]) {
    if (this.disabled) return;
    const res: any = [].concat.call([this._stringifyOptions()], (Array as any).prototype.slice.call(arguments));
    this.logger.log.apply(this.logger, res);
  }
  info(...args: any[]) {
    if (this.disabled) return;
    const res: any = [].concat.call(
      [chalk.blue(this._stringifyOptions())],
      (Array as any).prototype.slice.call(arguments as any),
    );
    this.logger.info.apply(this.logger, res);
  }
  error(...args: any[]) {
    const res: any = [].concat.call(
      [chalk.red(this._stringifyOptions())],
      (Array as any).prototype.slice.call(arguments as any),
    );
    this.logger.error.apply(this.logger, res);
  }
  warn(...args: any[]) {
    const res: any = [].concat.call(
      [chalk.yellow(this._stringifyOptions())],
      (Array as any).prototype.slice.call(arguments as any),
    );
    this.logger.warn.apply(this.logger, res);
  }

  sample(data: any, arg2?: any) {
    this.limiter.run(() => {
      this.info.apply(this, arguments as any);
    });
  }

  destroy() {
    this.verboseLoggerStream && this.verboseLoggerStream.end();
  }
}
