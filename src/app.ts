import fs from "node:fs";
import path from "node:path";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { globalRateLimiter } from "./middleware/rate-limit.middleware";
import { apiRouter } from "./routes";

export const app = express();

const openApiPath = path.resolve(process.cwd(), "docs", "numerology.openapi.yaml");
const openApiDocument = yaml.load(
  fs.readFileSync(openApiPath, "utf8")
) as Record<string, unknown>;

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin denied"));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(globalRateLimiter);
app.use(express.json());
app.get("/api/docs/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/", (_req, res) => {
  res.json({
    message: "Numora API is running",
    docs: "/api/docs"
  });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);