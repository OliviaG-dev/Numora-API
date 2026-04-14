import { getLetterValue, normalizeName, reduceToSingleDigit, validateName } from "./utils";
import type { BusinessNumbersResult } from "./types";

export function calculateWordValue(word: string): number {
  validateName(word);

  const normalizedWord = normalizeName(word);
  const letters = normalizedWord.replace(/[^A-Z]/g, "");
  const values = letters.split("").map((char) => getLetterValue(char));
  return values.reduce((acc, val) => acc + val, 0);
}

export function calculateBusinessNumbers(fullName: string): BusinessNumbersResult {
  validateName(fullName);
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) {
    throw new Error("Le nom doit contenir au moins un mot");
  }

  const expressionRaw = calculateWordValue(fullName.replace(/\s+/g, ""));
  const activeRaw = calculateWordValue(parts[0]);
  const hereditaryRaw = calculateWordValue(parts[parts.length - 1]);

  return {
    expression: {
      raw: expressionRaw,
      value: reduceToSingleDigit(expressionRaw, true)
    },
    active: {
      raw: activeRaw,
      value: reduceToSingleDigit(activeRaw, true)
    },
    hereditary: {
      raw: hereditaryRaw,
      value: reduceToSingleDigit(hereditaryRaw, true)
    }
  };
}
