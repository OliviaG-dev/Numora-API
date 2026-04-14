import fs from "node:fs";
import path from "node:path";

import cors from "cors";
import express from "express";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

import { apiRouter } from "./routes";

export const app = express();

const openApiPath = path.resolve(process.cwd(), "docs", "numerology.openapi.yaml");
const openApiDocument = yaml.load(
  fs.readFileSync(openApiPath, "utf8")
) as Record<string, unknown>;

app.use(cors());
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/api/docs/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

app.get("/", (_req, res) => {
  res.json({
    message: "Numora API is running",
    docs: "/api/docs"
  });
});

app.use("/api", apiRouter);