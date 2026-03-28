import { iRacingDataClient } from 'iracing-data-api';
const client = new iRacingDataClient();
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(m => !m.startsWith('_')));
