import { Router } from "express";

import {
  calculateNumerology,
  getNumerologyData,
  getNumerologyDataEntry,
  listNumerologyData
} from "../controllers/numerology.controller";
import { numerologyRateLimiter } from "../middleware/rate-limit.middleware";

export const numerologyRouter = Router();

numerologyRouter.post(
  "/numerology/calculate",
  numerologyRateLimiter,
  calculateNumerology
);
numerologyRouter.get("/numerology/data", listNumerologyData);
numerologyRouter.get("/numerology/data/:datasetId", getNumerologyData);
numerologyRouter.get(
  "/numerology/data/:datasetId/:entryKey",
  getNumerologyDataEntry
);
