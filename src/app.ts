/**
 * This is the main app file where the express app is created and configured
 */
import cluster from 'cluster';
import env from './config/env.json' with { type: 'json' };

const workers: Partial<Record<number, cluster.Worker>> = {};

// new express app singleton
import expressApp from './expressApp.js';
// Check if current process is master.

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  await import('./singletons/socket.js');
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

    if (error) {
      console.log('Exit handler error details:', {
        error,
        cleanup,
        exit,
        exitCode,
        event,
      });
    }

    if (cleanup) {
      // const isAliveFalseStatusForService = JSON.stringify({
      //   isAlive: false,
      //   timestamp: moment().toDate(),
      // });

      console.log('Cleanup completed', { processPid: process.pid });
    }

    if (exit) process.exit(exitCode || 0);
  };

  // do something when app is closing
  process.on('exit', async (exitCode) => {
    await exitHandler({ event: 'exit', exitCode });
  });

  // catches ctrl+c event
  process.on('SIGINT', async () => {
    await exitHandler({ event: 'SIGINT', cleanup: true, exit: true });
  });

  process.on('SIGTERM', async () => {
    await exitHandler({
      event: 'SIGTERM',
      cleanup: true,
      exit: true,
      exitCode: 1,
    });
  });

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', async () => {
    await exitHandler({
      event: 'SIGUSR1',
      cleanup: true,
      exit: true,
      exitCode: 1,
    });
  });
  process.on('SIGUSR2', async () => {
    await exitHandler({
      event: 'SIGUSR2',
      cleanup: true,
      exit: true,
      exitCode: 1,
    });
  });

  // catches uncaught exceptions
  process.on('uncaughtException', async (error) => {
    await exitHandler({
      event: 'uncaughtException',
      cleanup: true,
      exit: true,
      error,
      exitCode: 1,
    });
  });

  // Get the number of express workers from env or default to 1
  const expressWorkerCount = env.EXPRESS_WORKERS || 1;

  // Spawn a worker for every core.
  for (let j = 0; j < expressWorkerCount; j++) {
    const worker = cluster.fork();
    workers[worker.id] = worker;
  }

  // Cluster API has a variety of events.
  // Here we are creating a new process if a worker die.
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`, {
      processPid: process.pid,
    });
    delete workers[worker.id];
    const newWorker = cluster.fork();
    workers[newWorker.id] = newWorker;
  });

  if (env.NODE_ENV === 'development') {
    console.log(`Primary process ${process.pid} running. Node Environment: ${env.NODE_ENV}`);
  }
} else {
  // This is not the master process, so we spawn the express server.
  expressApp();
  if (env.NODE_ENV === 'development') {
    console.log(
      `Worker ${process.pid} started for express server. Listening on port ${env.NODE_PORT || 3000}`,
    );
  }
}
