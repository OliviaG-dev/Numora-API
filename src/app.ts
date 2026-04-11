import cors from "cors";
import express from "express";

import { apiRouter } from "./routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Numora API is running",
    docs: "/api/ping"
  });
});

app.use("/api", apiRouter);