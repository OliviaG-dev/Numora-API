import cycleKarmicData from "../../data/numerology/Karmique/CycleKarmicData.json";
import karmicNumberData from "../../data/numerology/Karmique/KarmicNumberData.json";
import {
  calculateExpressionNumber,
  calculateLifePathNumber,
  calculatePersonalityNumber,
  calculateSoulUrgeNumber
} from "./core";
import { normalizeName, validateDateString, validateName } from "./utils";

interface KarmicNumberResult {
  number: number;
  summary: string;
  challenge: string;
  details: string;
  keywords: string[];
}

interface KarmicNumbersResult {
  fullName: string;
  presentNumbers: number[];
  missingNumbers: number[];
  karmicDefinitions: KarmicNumberResult[];
}

interface CycleKarmicResult {
  number: number;
  summary: string;
  challenge: string;
  details: string;
  keywords: string[];
}

interface CycleKarmicNumbersResult {
  fullName: string;
  presentNumbers: number[];
  missingNumbers: number[];
  cycleKarmicDefinitions: CycleKarmicResult[];
}

interface KarmicDebtResult {
  number: number;
  isKarmicDebt: boolean;
  karmicDebtType?: 13 | 14 | 16 | 19;
}

type KarmicDebtType = 13 | 14 | 16 | 19;
const karmicDebtNumbers: KarmicDebtType[] = [13, 14, 16, 19];

export function calculateKarmicNumbers(dateString: string): KarmicNumbersResult {
  validateDateString(dateString);
  const digits = dateString.replace(/-/g, "").split("").map(Number);

  const presentNumbers = new Set<number>();
  for (const digit of digits) {
    if (digit >= 1 && digit <= 9) {
      presentNumbers.add(digit);
    }
  }

  const missingNumbers: number[] = [];
  for (let i = 1; i <= 9; i += 1) {
    if (!presentNumbers.has(i)) {
      missingNumbers.push(i);
    }
  }

  const karmicDefinitions: KarmicNumberResult[] = missingNumbers.map((num) => {
    const karmicData =
      karmicNumberData[num.toString() as keyof typeof karmicNumberData];
    return {
      number: num,
      summary: karmicData?.summary || "",
      challenge: karmicData?.challenge || "",
      details: karmicData?.details || "",
      keywords: karmicData?.keywords || []
    };
  });

  return {
    fullName: dateString,
    presentNumbers: Array.from(presentNumbers).sort(),
    missingNumbers,
    karmicDefinitions
  };
}

export function calculateCycleKarmicNumbers(
  fullName: string
): CycleKarmicNumbersResult {
  validateName(fullName);
  const cleanName = normalizeName(fullName).replace(/[^A-Z]/g, "");
  if (cleanName.length === 0) {
    throw new Error("Aucune lettre valide trouvee dans le nom");
  }

  const letterToNumber = (letter: string): number => {
    const charCode = letter.charCodeAt(0) - 64;
    return ((charCode - 1) % 9) + 1;
  };

  const presentNumbers = new Set<number>();
  for (const letter of cleanName) {
    presentNumbers.add(letterToNumber(letter));
  }

  const missingNumbers: number[] = [];
  for (let i = 1; i <= 9; i += 1) {
    if (!presentNumbers.has(i)) {
      missingNumbers.push(i);
    }
  }

  const cycleKarmicDefinitions: CycleKarmicResult[] = missingNumbers.map((num) => {
    const cycleData =
      cycleKarmicData[num.toString() as keyof typeof cycleKarmicData];
    return {
      number: num,
      summary: cycleData?.summary || "",
      challenge: cycleData?.challenge || "",
      details: cycleData?.details || "",
      keywords: cycleData?.keywords || []
    };
  });

  return {
    fullName,
    presentNumbers: Array.from(presentNumbers).sort(),
    missingNumbers,
    cycleKarmicDefinitions
  };
}

export function checkKarmicDebt(value: number): KarmicDebtResult {
  if (karmicDebtNumbers.includes(value as KarmicDebtType)) {
    return {
      number: value,
      isKarmicDebt: true,
      karmicDebtType: value as KarmicDebtType
    };
  }

  return {
    number: value,
    isKarmicDebt: false
  };
}

export function analyzeCoreNumbers(coreNumbers: number[]): KarmicDebtResult[] {
  return coreNumbers.map((num) => checkKarmicDebt(num));
}

export function calculateKarmicDebts(
  birthDate: string,
  fullName: string
): {
  lifePathDebt: KarmicDebtResult;
  expressionDebt: KarmicDebtResult;
  soulUrgeDebt: KarmicDebtResult;
  personalityDebt: KarmicDebtResult;
  birthdayDebt: KarmicDebtResult;
  allDebts: KarmicDebtResult[];
} {
  const lifePathNumber = calculateLifePathNumber(birthDate, false);
  const expressionNumber = calculateExpressionNumber(fullName, false);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName, false);
  const personalityNumber = calculatePersonalityNumber(fullName, false);
  const birthdayNumber = Number(birthDate.split("-")[2]);

  const lifePathDebt = checkKarmicDebt(lifePathNumber);
  const expressionDebt = checkKarmicDebt(expressionNumber);
  const soulUrgeDebt = checkKarmicDebt(soulUrgeNumber);
  const personalityDebt = checkKarmicDebt(personalityNumber);
  const birthdayDebt = checkKarmicDebt(birthdayNumber);

  const allDebts = [
    lifePathDebt,
    expressionDebt,
    soulUrgeDebt,
    personalityDebt,
    birthdayDebt
  ];

  return {
    lifePathDebt,
    expressionDebt,
    soulUrgeDebt,
    personalityDebt,
    birthdayDebt,
    allDebts
  };
}
