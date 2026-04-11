import { Router } from "express";

import { authRouter } from "./auth.routes";
import { healthRouter } from "./health.routes";
import { numerologyRouter } from "./numerology.routes";
import { readingsRouter } from "./readings.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(readingsRouter);
apiRouter.use(numerologyRouter);
