import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import qs from "qs";
import cookieParser from "cookie-parser";
import path from "path"
// const expressStatsd = require('express-statsd');
import passport from "passport"
// api routes and helpers
import router from "./api/routes.js"

// const { ALLOWED_EXTERNAL_ORIGINS = [], CLIENT_URL, NODE_PORT, WS_PORT } = require('./config/env.json');

// Initialize Awilix Container (this triggers MongoDB connection)
// const { container } = require('./singletons/awilixContainer');

// const response = require('./helpers/api/response');
// const logger = require('./helpers/logger/pino');

// const expressPinoHttpLogger = require('pino-http')({
//   // Reuse an existing logger instance
//   logger: logger.apiResponse,

//   // Set to `false` to prevent standard serializers from being wrapped.
//   wrapSerializers: true,

//   // Logger level is `info` by default
//   useLevel: 'info'
// });

// This must be the first piece of middleware in the stack.
// It can only capture errors in downstream middleware
// const { requestHandler, errorHandler } = bugsnagClient.getPlugin('express');
const nodePort =  3000;
const wsPort =  8000;

export default function expressApp (){
  // Initialize the Awilix container to trigger MongoDB connection
//   const awilixContainer = container('expressWorker');
//   console.log('✅ Awilix container initialized in worker process');
  
  // instantiate the express app
  const app = express();

//   app.use(requestHandler);

  // Don't send server app information in api response
  app.disable('x-powered-by');

  // add all other middlewares
  app.use(cors());
//   app.use(passport.initialize());

  // Use CORS
  // Match all OPTIONS requests on any path and apply CORS headers
  app.options('/*splat', cors());

  // Database Connection
  // mongoose.connect(config.database);

  // Setting up basic middleware for all Express requests
//   app.use(expressPinoHttpLogger);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(cookieParser('Veera@2026'));

  // Enable CORS from client-side
  app.use((req, res, next) => {
    const allowedOrigins = [`ws://localhost:${wsPort}`];
    const { origin } = req.headers;
    // const allAllowedOrigin = [...allowedOrigins, ...ALLOWED_EXTERNAL_ORIGINS, CLIENT_URL];
    // if (allAllowedOrigin.includes('*')) {
    //   res.setHeader('Access-Control-Allow-Origin', '*');
    // } else if (allAllowedOrigin.includes(origin)) {
    //   res.setHeader('Access-Control-Allow-Origin', origin);
    // } else {
    //   res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
    // }
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Api-Key'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.set('trust proxy', true);
  // Parse query strings using qs library
  app.set("query parser", (str: string) => qs.parse(str));

  // setup view engine
//   app.set('view engine', 'js');
//   app.set('views', path.join(__dirname, '/views'));
//   app.engine('js', reactViews);

//   app.use(express.static(path.join(__dirname, '/views')));

  // add express statsd middleware for api metrics
//   app.use(expressStatsd({ client: statsD }));

  router(app);

  // Error handler
  // eslint-disable-next-line no-unused-vars
//   app.use((error, req, res, next) => {
//     const status = error.status || 500;
//     res.status(status).json(response.error(req, error, 'Something went wrong. Please try again', null));
//   });

  // errorhandler to be the last middleware
  // This handles any errors that Express catches
//   app.use(errorHandler);

  // Start the server
  // Made static to start on default 3000 port ONLY
  app.listen(nodePort);
};

