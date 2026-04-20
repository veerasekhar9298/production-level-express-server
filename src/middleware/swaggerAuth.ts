// src/middleware/swaggerAuth.ts
import type { Request, Response, NextFunction } from 'express';
import basicAuth from 'express-basic-auth';

export const swaggerAuth =
  process.env.NODE_ENV === 'development'
    ? basicAuth({
        users: {
          admin: process.env.SWAGGER_PASSWORD || 'admin',
        },
        challenge: true,
      })
    : (req: Request, res: Response, next: NextFunction) => next();
