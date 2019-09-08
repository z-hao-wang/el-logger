import * as _ from 'lodash';

export class RateLimit {
  private firedTs: number[];
  private times: number;
  private seconds: number;
  constructor(times: number, seconds: number) {
    // Limit X times per Y seconds
    // Drop extra
    this.firedTs = [];
    this.times = times;
    this.seconds = seconds;
  }

  run(cb: any) {
    const now = new Date().getTime();
    // drop any old data
    this.firedTs = _.filter(this.firedTs, ts => ts > now - this.seconds * 1000);
    if (this.firedTs.length < this.times) {
      this.firedTs.push(now);
      cb();
    }
  }
}
