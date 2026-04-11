import { Router } from "express";

import { calculateNumerology } from "../controllers/numerology.controller";

export const numerologyRouter = Router();

numerologyRouter.post("/numerology/calculate", calculateNumerology);
