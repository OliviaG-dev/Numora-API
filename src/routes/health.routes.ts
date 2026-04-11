import { Router } from "express";

import { ping } from "../controllers/health.controller";

export const healthRouter = Router();

healthRouter.get("/ping", ping);
