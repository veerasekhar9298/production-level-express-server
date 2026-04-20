import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import healthCheckRoutes from './healthCheckRoutes.js';
import { setupSwagger } from '../docs/setupSwagger.js';
import { swaggerAuth } from '../middleware/swaggerAuth.js';

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from Express 5 + Apollo v5 🚀',
  },
};

const router = async (app: Application) => {
  const apiRoutes = express.Router();
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await gqlServer.start();

  apiRoutes.use('/health-check', healthCheckRoutes);

  apiRoutes.use('/docs', swaggerAuth);
  setupSwagger(app);

  apiRoutes.use('/graphql', cors(), bodyParser.json(), expressMiddleware(gqlServer)); //   // Mounting V2 routes on api

  // If no routes matches
  apiRoutes.use((req: Request, res: Response, next: NextFunction) => {
    apiRoutes.use((req: Request, res: Response) => {
      res.status(404).json({ message: 'Route not found' });
    });
    return next();
  });

  app.use('/api', apiRoutes);
};

export default router;
