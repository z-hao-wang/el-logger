"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class RateLimit {
    constructor(times, seconds) {
        // Limit X times per Y seconds
        // Drop extra
        this.firedTs = [];
        this.times = times;
        this.seconds = seconds;
    }
    run(cb) {
        const now = new Date().getTime();
        // drop any old data
        this.firedTs = _.filter(this.firedTs, ts => ts > now - this.seconds * 1000);
        if (this.firedTs.length < this.times) {
            this.firedTs.push(now);
            cb();
        }
    }
}
exports.RateLimit = RateLimit;
