export declare class RateLimit {
    private firedTs;
    private times;
    private seconds;
    constructor(times: number, seconds: number);
    run(cb: any): void;
}
