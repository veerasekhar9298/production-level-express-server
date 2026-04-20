import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

import { z } from "zod";
extendZodWithOpenApi(z);
export const HealthResponseSchema = z.object({
  status: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
});