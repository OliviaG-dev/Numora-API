import {
  calculateAddressVibration,
  calculateAllVibrations,
  calculateBirthdayNumber,
  calculateBusinessNumbers,
  calculateChallengeNumbers,
  calculateCycleKarmicNumbers,
  calculateExpressionNumber,
  calculateHeartNumber,
  calculateKarmicDebts,
  calculateKarmicNumbers,
  calculateLifeCycles,
  calculateLifePathNumber,
  calculateLocalityVibration,
  calculatePersonalNumbers,
  calculatePersonalityNumber,
  calculateRealizationPeriods,
  calculateRealisationNumber,
  calculateSoulUrgeNumber
} from "../modules/numerology";
import { analyzeTreeOfLife } from "../modules/arbreDeVie";
import { calculateMatrixDestiny } from "../modules/matrixDestiny";
import * as numerologyDataCatalog from "../data";

interface AddressInput {
  streetNumber: string;
  streetName: string;
  allowMasterNumbers?: boolean;
}

interface LocalityInput {
  postalCode: string;
  city: string;
  allowMasterNumbers?: boolean;
}

export interface NumerologyCalculationInput {
  fullName: string;
  birthDate: string;
  address?: AddressInput;
  locality?: LocalityInput;
  referenceDate?: string;
}

type DatasetValue = Record<string, unknown> | unknown[];

interface DatasetSummary {
  id: string;
  kind: "array" | "object";
  size: number;
}

const DATASET_EXCLUDED_EXPORTS = new Set<string>(["VALID_NUMEROLOGY_NUMBERS"]);

function isDatasetValue(value: unknown): value is DatasetValue {
  return Array.isArray(value) || (typeof value === "object" && value !== null);
}

function getDatasetsRecord(): Record<string, DatasetValue> {
  const entries = Object.entries(numerologyDataCatalog).filter(
    ([key, value]) =>
      !DATASET_EXCLUDED_EXPORTS.has(key) &&
      isDatasetValue(value) &&
      key.toLowerCase().includes("data")
  );

  return Object.fromEntries(entries) as Record<string, DatasetValue>;
}

export function listNumerologyDatasets(): DatasetSummary[] {
  const datasets = getDatasetsRecord();

  return Object.entries(datasets)
    .map(([id, value]) => ({
      id,
      kind: (Array.isArray(value) ? "array" : "object") as "array" | "object",
      size: Array.isArray(value) ? value.length : Object.keys(value).length
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getNumerologyDataset(datasetId: string): DatasetValue | null {
  const datasets = getDatasetsRecord();
  return datasets[datasetId] ?? null;
}

export function getNumerologyDatasetEntry(
  datasetId: string,
  entryKey: string
): unknown | null {
  const dataset = getNumerologyDataset(datasetId);
  if (!dataset) {
    return null;
  }

  if (Array.isArray(dataset)) {
    const index = Number(entryKey);
    if (!Number.isInteger(index) || index < 0 || index >= dataset.length) {
      return null;
    }
    return dataset[index];
  }

  return dataset[entryKey] ?? null;
}

export function calculateNumerologyProfile(input: NumerologyCalculationInput) {
  const [year, month, day] = input.birthDate.split("-").map(Number);

  if ([year, month, day].some((value) => Number.isNaN(value))) {
    throw new Error('Format de birthDate invalide. Utilisez "YYYY-MM-DD"');
  }

  const birthDay = day;
  const birthMonth = month;

  const referenceDate = input.referenceDate
    ? new Date(input.referenceDate)
    : new Date();
  if (Number.isNaN(referenceDate.getTime())) {
    throw new Error('Format de referenceDate invalide. Utilisez "YYYY-MM-DD"');
  }

  const lifePath = calculateLifePathNumber(input.birthDate);
  const expression = calculateExpressionNumber(input.fullName);
  const soulUrge = calculateSoulUrgeNumber(input.fullName);
  const personality = calculatePersonalityNumber(input.fullName);
  const birthday = calculateBirthdayNumber(birthDay);
  const heart = calculateHeartNumber(input.fullName);
  const realisation = calculateRealisationNumber(expression);
  const challengeNumbers = calculateChallengeNumbers(birthDay, birthMonth, year);
  const lifeCycles = calculateLifeCycles(birthDay, birthMonth, year);
  const realizationPeriods = calculateRealizationPeriods(
    birthDay,
    birthMonth,
    year
  );
  const karmicNumbers = calculateKarmicNumbers(input.birthDate);
  const cycleKarmicNumbers = calculateCycleKarmicNumbers(input.fullName);
  const karmicDebts = calculateKarmicDebts(input.birthDate, input.fullName);
  const matrixDestiny = calculateMatrixDestiny(birthDay, birthMonth, year);
  const treeOfLife = analyzeTreeOfLife(input.birthDate);

  const addressVibration = input.address
    ? calculateAddressVibration(input.address)
    : undefined;
  const localityVibration = input.locality
    ? calculateLocalityVibration(input.locality)
    : undefined;

  return {
    identity: {
      fullName: input.fullName,
      birthDate: input.birthDate
    },
    core: {
      lifePath,
      expression,
      soulUrge,
      personality,
      birthday,
      heart,
      realisation
    },
    personal: calculatePersonalNumbers(birthDay, birthMonth, referenceDate),
    challenges: {
      challengeNumbers,
      lifeCycles,
      realizationPeriods
    },
    karmic: {
      karmicNumbers,
      cycleKarmicNumbers,
      karmicDebts
    },
    matrixDestiny,
    treeOfLife,
    universalVibrations: calculateAllVibrations(referenceDate),
    business: calculateBusinessNumbers(input.fullName),
    place: {
      addressVibration,
      localityVibration
    }
  };
}
