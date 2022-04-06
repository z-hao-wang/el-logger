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

  // if fired, return true, otherwise return false
  run(cb: any): boolean {
    const now = new Date().getTime();
    // drop any old data
    this.firedTs = this.firedTs.filter(ts => ts > now - this.seconds * 1000);
    if (this.firedTs.length < this.times) {
      this.firedTs.push(now);
      cb();
      return true;
    }
    return false;
  }

  // if fired, return true, otherwise return false
  runWithTs(now: number, cb: any): boolean {
    // drop any old data
    this.firedTs = this.firedTs.filter(ts => ts > now - this.seconds * 1000);
    if (this.firedTs.length < this.times) {
      this.firedTs.push(now);
      cb();
      return true;
    }
    return false;
  }
}
