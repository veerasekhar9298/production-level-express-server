/**
 * TO BE USED ON MAIN THREAD ONLY
 * FILES: ENGINE / REFRESH CLIENTS (INDEX)
 * PLEASE DO NOT IMPORT THIS IN ANY OTHER FILE
 */
import { frontEndWebsocket } from './socket.js';

// const Logger = require('../helpers/logger');

// const logger = new Logger();

const emitToFrontEndByWebsocket = (topic: string, data: any) => {
  try {
    frontEndWebsocket.emit(topic, data);
  } catch (error) {
    console.log(error);
    // logger.error({
    //   file: 'mainThread',
    //   service: 'webSocketEmitter',
    //   method: 'emitToFrontEndByWebsocket',
    //   meta: { topic, data, error },
    //   report: true,
    // });
  }
};

export default emitToFrontEndByWebsocket;
