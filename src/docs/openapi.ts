// src/docs/openapi.ts
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { HealthResponseSchema } from "../schemas/health.schema.js";

const registry = new OpenAPIRegistry();

registry.register("HealthResponse", HealthResponseSchema);
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});
registry.registerPath({
  method: "get",
  path: "/health-check",
  tags: ["System"],
  summary: "Health check",
  responses: {
    200: {
      description: "Server is healthy",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
  servers: [{ url: "/api" }],
   security: [{ bearerAuth: [] }],
});