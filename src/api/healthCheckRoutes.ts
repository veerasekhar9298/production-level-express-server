import express from "express"
import type { Request,Response } from "express";
import moment from "moment";
import { timeStamp } from "node:console";
import { uptime } from "node:process";
const healthCheckRoutes = express.Router();

healthCheckRoutes.get('/', (req:Request, res:Response) => {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  res.status(200).json({ status: 'UP',uptime:process.uptime(),timestamp:moment().toDate() });
});

export default healthCheckRoutes
