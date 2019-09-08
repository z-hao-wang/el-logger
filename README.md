# logger

## usage

```
npm i elLogger --save

import { Logger } from 'el-logger';
const logger = new Logger({ name: 'my instance' });

const logger = new Logger({ disabled: true });

const logger = new Logger({ sampleRate: 5 });
logger.sample(`some log`); // log max 5 times every second

logger.log(`something`);
```
