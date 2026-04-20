// src/docs/setupSwagger.ts
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";
import type { Application,Request,Response } from "express";

export function setupSwagger(app: Application) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.get("/docs.json", (req:Request, res:Response) => {
    res.json(openApiDocument);
  });
}