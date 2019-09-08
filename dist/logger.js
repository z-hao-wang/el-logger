"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const moment = require("moment");
const _ = require("lodash");
const rateLimit_1 = require("./rateLimit");
const DEFAULT_SAMPLE_RATE = 2; // log x times every DEFAULT_SAMPLE_PERIOD seconds
const DEFAULT_SAMPLE_PERIOD = 5;
class Logger {
    constructor(options) {
        this.logger = console;
        this.options = options || {};
        this.counter = 0;
        const rate = this.options.sampleRate || DEFAULT_SAMPLE_RATE;
        this.limiter = new rateLimit_1.RateLimit(rate, DEFAULT_SAMPLE_PERIOD);
    }
    // replace console with custom logger
    setLoggerClass(logger) {
        this.logger = logger;
    }
    setDisabled(disabled) {
        this.options.disabled = disabled;
    }
    _limitedLogInfo() {
        this.info.apply(this, arguments);
    }
    _stringifyOptions() {
        let stringifyOptions = '';
        _.forOwn(this.options, (value, key) => {
            if (!_.includes(['sampleRate', 'disabled'], key)) {
                stringifyOptions += `${key}=${value} `;
            }
        });
        return moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + stringifyOptions.substring(0, stringifyOptions.length - 1);
    }
    _getVerboseLogFileName() {
        let fileName = '';
        _.forOwn(this.options, (value, key) => {
            if (key !== 'sampleRate') {
                fileName += `${value}`;
            }
        });
        return fileName;
    }
    log(...args) {
        if (this.options.disabled)
            return;
        const res = [].concat.call([this._stringifyOptions()], Array.prototype.slice.call(arguments));
        this.logger.log.apply(this.logger, res);
    }
    info(...args) {
        if (this.options.disabled)
            return;
        const res = [].concat.call([chalk_1.default.blue(this._stringifyOptions())], Array.prototype.slice.call(arguments));
        this.logger.info.apply(this.logger, res);
    }
    error(...args) {
        const res = [].concat.call([chalk_1.default.red(this._stringifyOptions())], Array.prototype.slice.call(arguments));
        this.logger.error.apply(this.logger, res);
    }
    warn(...args) {
        const res = [].concat.call([chalk_1.default.yellow(this._stringifyOptions())], Array.prototype.slice.call(arguments));
        this.logger.warn.apply(this.logger, res);
    }
    sample(data, arg2) {
        this.limiter.run(() => {
            this.info.apply(this, arguments);
        });
    }
    destroy() {
        this.verboseLoggerStream && this.verboseLoggerStream.end();
    }
}
exports.Logger = Logger;
