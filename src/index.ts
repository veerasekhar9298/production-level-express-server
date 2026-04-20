import { fileURLToPath } from "url";
import path from "path";
import child_process from "child_process";
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import "./app.js";

if (process.env.NODE_ENV !== 'development') {
  global.__basedir = path.resolve(__dirname, '../');
} else {
  global.__basedir = __dirname;
}


let dbMigrationProcess = null;

/**
 * initialize db migration process as a child process and attach handlers for exit and messaging
 */
const initDbMigrationProcess = async() => {
//   logger.info({
//     file: 'mainThread',
//     service: 'index',
//     method: 'initDbMigrationProcess'
//   });

  // spawn child process
//   if (process.env.NODE_ENV === 'development') {
//     dbMigrationProcess = child_process.fork('./src/migration');
//   } else {
//     dbMigrationProcess = child_process.fork('./build/migration');
//   }

//   dbMigrationProcess.on('error', err => {
//     logger.error({
//       file: 'mainThread',
//       service: 'index',
//       method: 'dbMigrationProcessOnError',
//       meta: { error: err }
//     });
//   }); // end on error handler

//   dbMigrationProcess.on('message', message => {
    // logger.info({
    //   file: 'mainThread',
    //   service: 'index',
    //   method: 'dbMigrationProcessOnMessage',
    //   meta: { message }
    // });

    // switch (message.action) {
    //   case 'notifyMigrationComplete':
        // default:
        // logger.info({
        //   file: 'mainThread',
        //   service: 'index',
        //   method: 'dbMigrationProcessOnMessage',
        //   meta: { action: 'notifyMigrationComplete' },
        //   message: 'dbMigrationProcess responded with status completed'
        // });

        // kill the db migration process once it has successfully ran
        // dbMigrationProcess && dbMigrationProcess.kill('SIGINT');

        /**
         * initialize the main insite app only when db migration has run successfully
         * in case of errors do not start the main app
         */
        // require('./app');
        // break;
    // }
//   }); // end on message handler


//   dbMigrationProcess.on('exit', code => {
//     logger.error({
//       file: 'mainThread',
//       service: 'index',
//       method: 'dbMigrationProcessOnExit',
//       meta: { code }
//     });

//     if (dbMigrationProcess) {
//       dbMigrationProcess.kill();
//       process.exit(1); // exit with 1 so that docker knows it is an error and tries to restart the container
//     }
//   }); // end on exit handler
          // require('./app');
          await import("./app.js");

}; // end initDbMigrationProcess

// ****************** Initialize the db migration child process ***********************
initDbMigrationProcess();

