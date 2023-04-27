const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const entryIndex = args.indexOf('--entry');

// if (entryIndex === -1) {
//     console.error('Use cli like : pnpm start -- --entry /path/to/entry.js');
//     process.exit(1);
// }

const entryFile = args[entryIndex + 1];

process.env.ENTRY_FILE = entryFile;

const envPath = path.resolve(__dirname, '../.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
    require('dotenv').config({ path: envPath });
}
