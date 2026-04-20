import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import './app.js';

if (process.env.NODE_ENV !== 'development') {
  global.__basedir = path.resolve(__dirname, '../');
} else {
  global.__basedir = __dirname;
}

// const dbMigrationProcess = null;

/**
 * initialize db migration process as a child process and attach handlers for exit and messaging
 */
const initDbMigrationProcess = async () => {
  await import('./app.js');
}; // end initDbMigrationProcess

// ****************** Initialize the db migration child process ***********************
initDbMigrationProcess();
