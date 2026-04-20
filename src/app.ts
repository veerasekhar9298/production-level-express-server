/**
 * This is the main app file where the express app is created and configured
 */
import moment from "moment";
import cluster from "cluster";
import env from "./config/env.json" with { type: "json" };

const workers: Partial<Record<number, cluster.Worker>> = {};

// new express app singleton
import expressApp from "./expressApp.js";
// Check if current process is master.
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  //   const { eventChannels } = require('./constants');

  //   (async function init() {
  // logger.info({
  //   file: 'mainThread',
  //   service: 'app',
  //   method: 'init',
  //   message: 'perform init actions'
  // });
  // console.log('Performing init actions', { processPid: process.pid });
  // await redisCacheService.initCaching();
  // await actuatorSubscribeService.subscribeToActuatorTopics();
  //   })();

  // Initialize CRON background jobs
  //   initializeCronBackgroundJobs();

  // On init refresh all connected clients via socket
  //   refreshClients();

  // handling process termination and dangling child-processes

  // https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

  // process.stdin.resume(); // so the program will not close instantly

  const exitHandler = async ({
    error,
    cleanup,
    exit,
    event,
    exitCode,
  }: {
    error?: unknown;
    cleanup?: boolean;
    exit?: boolean;
    event: string;
    exitCode?: number;
  }) => {
    console.log(`Exit handler called due to event: ${event}`, {
      error,
      cleanup,
      exit,
      exitCode,
      event,
    });
    // logger.info({
    //   file: 'mainThread',
    //   service: 'app',
    //   method: 'exitHandler',
    //   meta: { error, cleanup, exit, exitCode, event }
    // });

    if (error) {
      //   logger.error({
      //     file: 'mainThread',
      //     service: 'app',
      //     method: 'exitHandler',
      //     meta: { error, cleanup, exit, exitCode, event },
      //     report: true
      //   });
      console.log("Exit handler error details:", {
        error,
        cleanup,
        exit,
        exitCode,
        event,
      });
    }

    if (cleanup) {
      // logger.debug({
      //   file: 'mainThread',
      //   service: 'app',
      //   method: 'exitHandler',
      //   message: 'cleanup starting'
      //   });

      const isAliveFalseStatusForService = JSON.stringify({
        isAlive: false,
        timestamp: moment().toDate(),
      });

      //   logger.debug({
      //     file: 'hardwareDiagnostics',
      //     service: 'app',
      //     method: 'exitHandler',
      //     meta: { exitCode, isAliveFalseStatusForService }
      //   });

      //   logger.debug({
      //     file: 'mainThread',
      //     service: 'app',
      //     method: 'exitHandler',
      //     message: 'cleanup completed'
      //   });
      console.log("Cleanup completed", { processPid: process.pid });

      // block for 5s to ensure child process can run their cleanup
      // await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (exit) process.exit(exitCode || 0);
  };

  // do something when app is closing
  process.on("exit", async (exitCode) => {
    await exitHandler({ event: "exit", exitCode });
  });

  // catches ctrl+c event
  process.on("SIGINT", async () => {
    await exitHandler({ event: "SIGINT", cleanup: true, exit: true });
  });

  process.on("SIGTERM", async () => {
    await exitHandler({
      event: "SIGTERM",
      cleanup: true,
      exit: true,
      exitCode: 1,
    });
  });

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", async () => {
    await exitHandler({
      event: "SIGUSR1",
      cleanup: true,
      exit: true,
      exitCode: 1,
    });
  });
  process.on("SIGUSR2", async () => {
    await exitHandler({
      event: "SIGUSR2",
      cleanup: true,
      exit: true,
      exitCode: 1,
    });
  });

  // catches uncaught exceptions
  process.on("uncaughtException", async (error) => {
    await exitHandler({
      event: "uncaughtException",
      cleanup: true,
      exit: true,
      error,
      exitCode: 1,
    });
  });

  // Get the number of express workers from env or default to 1
  const expressWorkerCount = 1;

  // Spawn a worker for every core.
  for (let j = 0; j < expressWorkerCount; j++) {
    const worker = cluster.fork();
    workers[worker.id] = worker;
  }

  // Cluster API has a variety of events.
  // Here we are creating a new process if a worker die.
  cluster.on("exit", (worker, code, signal) => {
    // logger.info({
    //   file: 'mainThread',
    //   service: 'app',
    //   method: 'exitHandler',
    //   message: `worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    // });
    console.log(
      `worker ${worker.process.pid} died with code ${code} and signal ${signal}`,
      { processPid: process.pid },
    );
    delete workers[worker.id];
    const newWorker = cluster.fork();
    workers[newWorker.id] = newWorker;
  });

  if (env.NODE_ENV === "development") {
    console.log(
      `Primary process ${process.pid} running. Node Environment: ${env.NODE_ENV}`,
    );
  }
} else {
  // This is not the master process, so we spawn the express server.
  expressApp();
  if (env.NODE_ENV === "development") {
    console.log(
      `Worker ${process.pid} started for express server. Listening on port ${env.NODE_PORT || 3000}`,
    );
  }

  //   logger.info({
  //     file: 'mainThread',
  //     service: 'app',
  //     method: 'init',
  //     meta: { port: 3000, process_pid: process.pid },
  //     message: `Worker ${process.pid} started for express server`
  //   });
}
