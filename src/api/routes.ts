import express, { application } from "express";
import type { Application, Request, Response, NextFunction } from "express";
import healthCheckRoutes from "./healthCheckRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { setupSwagger } from "../docs/setupSwagger.js";
import { swaggerAuth } from "../middleware/swaggerAuth.js";
import { expressMiddleware } from "@as-integrations/express5";

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello from Express 5 + Apollo v5 🚀",
  },
};

const router = async (app: Application) => {
  const apiRoutes = express.Router();
  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await gqlServer.start();
  
  apiRoutes.use("/health-check", healthCheckRoutes);
  
  apiRoutes.use('/docs',swaggerAuth)
  setupSwagger(app)

apiRoutes.use("/graphql", cors(), bodyParser.json(), expressMiddleware(gqlServer));  //   // Mounting V2 routes on api
  //   apiRoutes.use('/v2', v2Routes);

  //   // Mounting V3 routes on api
  //   apiRoutes.use('/v3', v3Routes);

  // Mounting Web Integration Routes
  //   apiRoutes.use('/web-integrations', webIntegrationRoutes);

  //   apiRoutes.use('/shortener', shortenerRoutes);

  // If no routes matches
  apiRoutes.use((req: Request, res: Response, next: NextFunction) => {
 apiRoutes.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});
    return next();
  });

  app.use("/api", apiRoutes);

  // this route is not exposed on the reverse proxy; for internal service use only
  //   app.use('/simulation-app-api', simulationScriptRoutes);
};

export default router;
