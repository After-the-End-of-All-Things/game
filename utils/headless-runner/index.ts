import { names } from './names';
import { play } from './play';

const argv = require('minimist')(process.argv.slice(2));

const numClients = Math.min(names.length, +argv.clients) ?? 1;

for (let i = 0; i < numClients; i++) {
  play(names[i], i);
}
