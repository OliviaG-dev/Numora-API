import { Request, Response } from "express";

import {
  calculateNumerologyProfile,
  type NumerologyCalculationInput
} from "../services/numerology.service";

export function calculateNumerology(req: Request, res: Response): void {
  try {
    const input = req.body as Partial<NumerologyCalculationInput>;

    if (!input.fullName || !input.birthDate) {
      res.status(400).json({
        error: "Les champs fullName et birthDate sont requis"
      });
      return;
    }

    const result = calculateNumerologyProfile({
      fullName: input.fullName,
      birthDate: input.birthDate,
      address: input.address,
      locality: input.locality,
      referenceDate: input.referenceDate
    });

    res.status(200).json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur numerology inconnue";
    res.status(400).json({ error: message });
  }
}
