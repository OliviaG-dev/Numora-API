import { Request, Response } from "express";

import {
  calculateNumerologyProfile,
  getNumerologyDataset,
  getNumerologyDatasetEntry,
  listNumerologyDatasets,
  type NumerologyCalculationInput
} from "../services/numerology.service";
import { HttpError, asyncHandler } from "../utils/http";
import { numerologyCalculationSchema } from "../validation/request-schemas";

function getSingleParam(param: string | string[] | undefined): string | null {
  if (typeof param === "string") {
    return param;
  }
  if (Array.isArray(param) && param.length > 0) {
    return param[0];
  }
  return null;
}

export const calculateNumerology = asyncHandler((req: Request, res: Response): void => {
  const input = numerologyCalculationSchema.parse(req.body) as NumerologyCalculationInput;
  const result = calculateNumerologyProfile(input);
  res.status(200).json({ result });
});

export function listNumerologyData(req: Request, res: Response): void {
  const datasets = listNumerologyDatasets();
  res.status(200).json({ datasets });
}

export function getNumerologyData(req: Request, res: Response): void {
  const datasetId = getSingleParam(req.params.datasetId);
  if (!datasetId) {
    res.status(400).json({ error: "Parametre datasetId invalide" });
    return;
  }
  const dataset = getNumerologyDataset(datasetId);

  if (!dataset) {
    throw new HttpError(404, `Dataset introuvable: ${datasetId}`);
  }

  res.status(200).json({ datasetId, dataset });
}

export function getNumerologyDataEntry(req: Request, res: Response): void {
  const datasetId = getSingleParam(req.params.datasetId);
  const entryKey = getSingleParam(req.params.entryKey);
  if (!datasetId || !entryKey) {
    res.status(400).json({ error: "Parametres datasetId/entryKey invalides" });
    return;
  }
  const entry = getNumerologyDatasetEntry(datasetId, entryKey);

  if (entry === null) {
    throw new HttpError(404, `Entree introuvable: ${datasetId}/${entryKey}`);
  }

  res.status(200).json({ datasetId, entryKey, entry });
}
