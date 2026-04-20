import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import qs from 'qs';
// const expressStatsd = require('express-statsd');
// api routes and helpers
import router from './api/routes.js';

const nodePort = 3000;
// const wsPort = 8000;

export default function expressApp() {
  // instantiate the express app
  const app = express();

  // Don't send server app information in api response
  app.disable('x-powered-by');

  // add all other middlewares
  app.use(cors());

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
    // const allowedOrigins = [`ws://localhost:${wsPort}`];
    // const { origin } = req.headers;
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
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Api-Key',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.set('trust proxy', true);
  // Parse query strings using qs library
  app.set('query parser', (str: string) => qs.parse(str));

  // setup view engine
  //   app.set('view engine', 'js');
  //   app.set('views', path.join(__dirname, '/views'));
  //   app.engine('js', reactViews);

  //   app.use(express.static(path.join(__dirname, '/views')));

  // add express statsd middleware for api metrics
  //   app.use(expressStatsd({ client: statsD }));

  router(app);

  // Error handler

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
}
