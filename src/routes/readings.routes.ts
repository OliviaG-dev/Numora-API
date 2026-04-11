import { Router } from "express";

import {
  createReading,
  deleteReading,
  getReadingById,
  getReadings
} from "../controllers/readings.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const readingsRouter = Router();

readingsRouter.get("/readings", requireAuth, getReadings);
readingsRouter.post("/readings", requireAuth, createReading);
readingsRouter.get("/readings/:id", requireAuth, getReadingById);
readingsRouter.delete("/readings/:id", requireAuth, deleteReading);
