import {
  getLetterValue,
  normalizeName,
  reduceToSingleDigit,
  validateDateString,
  validateDay,
  validateName
} from "./utils";

export function calculateLifePathNumber(
  dateString: string,
  reduce: boolean = true
): number {
  validateDateString(dateString);
  const digits = dateString.replace(/-/g, "").split("").map(Number);
  const total = digits.reduce((acc, val) => acc + val, 0);
  return reduce ? reduceToSingleDigit(total) : total;
}

export function calculateExpressionNumber(
  fullName: string,
  reduce: boolean = true
): number {
  validateName(fullName);
  const normalizedName = normalizeName(fullName);
  const nameDigits = normalizedName
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((letter) => getLetterValue(letter))
    .filter((num) => num > 0);

  if (nameDigits.length === 0) {
    throw new Error("Aucune lettre valide trouvee dans le nom");
  }

  const total = nameDigits.reduce((acc, val) => acc + val, 0);
  return reduce ? reduceToSingleDigit(total) : total;
}

export function calculateSoulUrgeNumber(
  fullName: string,
  reduce: boolean = true
): number {
  validateName(fullName);
  const normalizedName = normalizeName(fullName);
  const vowels = normalizedName
    .replace(/[^AEIOU]/g, "")
    .split("")
    .map((letter) => getLetterValue(letter))
    .filter((num) => num > 0);

  if (vowels.length === 0) {
    throw new Error("Aucune voyelle trouvee dans le nom");
  }

  const total = vowels.reduce((acc, val) => acc + val, 0);
  return reduce ? reduceToSingleDigit(total) : total;
}

export function calculatePersonalityNumber(
  fullName: string,
  reduce: boolean = true
): number {
  validateName(fullName);
  const normalizedName = normalizeName(fullName);
  const consonants = normalizedName
    .replace(/[AEIOU]/g, "")
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((letter) => getLetterValue(letter))
    .filter((num) => num > 0);

  if (consonants.length === 0) {
    throw new Error("Aucune consonne trouvee dans le nom");
  }

  const total = consonants.reduce((acc, val) => acc + val, 0);
  return reduce ? reduceToSingleDigit(total) : total;
}

export function calculateBirthdayNumber(day: number): number {
  validateDay(day);
  return reduceToSingleDigit(day, false);
}

export function calculateRealisationNumber(
  value: number,
  reduce: boolean = true
): number {
  if (value < 0 || !Number.isInteger(value)) {
    throw new Error("Le nombre de realisation doit etre un entier positif");
  }

  if (value <= 9 || value === 11 || value === 22 || value === 33) {
    return value;
  }

  return reduce ? reduceToSingleDigit(value) : value;
}

export function calculateHeartNumber(
  fullName: string,
  reduce: boolean = true
): number {
  validateName(fullName);

  const vowelsMap: Record<string, number> = {
    A: 1,
    E: 5,
    I: 9,
    O: 6,
    U: 3,
    Y: 7
  };

  const cleanName = fullName
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");

  const vowels = cleanName.split("").filter((letter) => vowelsMap[letter]);
  if (vowels.length === 0) {
    throw new Error("Aucune voyelle trouvee dans le nom");
  }

  const total = vowels.reduce((sum, letter) => sum + vowelsMap[letter], 0);
  return reduce ? reduceToSingleDigit(total) : total;
}
