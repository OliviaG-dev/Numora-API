export const LETTER_VALUES: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  O: 6,
  P: 7,
  Q: 8,
  R: 9,
  S: 1,
  T: 2,
  U: 3,
  V: 4,
  W: 5,
  X: 6,
  Y: 7,
  Z: 8
};

export const MASTER_NUMBERS = [11, 22, 33];

export function getLetterValue(letter: string): number {
  return LETTER_VALUES[letter] || 0;
}

export function reduceToSingleDigit(
  num: number,
  allowMasterNumbers: boolean = true
): number {
  if (allowMasterNumbers && MASTER_NUMBERS.includes(num)) return num;
  if (num < 10) return num;

  const digits = num.toString().split("").map(Number);
  const sum = digits.reduce((acc, val) => acc + val, 0);
  return reduceToSingleDigit(sum, allowMasterNumbers);
}

export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export function validateDateString(dateString: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error('Format de date invalide. Utilisez "YYYY-MM-DD"');
  }

  const digits = dateString.replace(/-/g, "").split("").map(Number);
  if (digits.some((digit) => Number.isNaN(digit))) {
    throw new Error("La date ne doit contenir que des chiffres et des tirets");
  }
}

export function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error("Le nom ne peut pas etre vide");
  }
}

export function validateDay(day: number): void {
  if (day < 1 || day > 31) {
    throw new Error("Le jour doit etre entre 1 et 31");
  }
}

export function validateMonth(month: number): void {
  if (month < 1 || month > 12) {
    throw new Error("Le mois doit etre entre 1 et 12");
  }
}

export function validateYear(year: number): void {
  if (year < 1900 || year > 2100) {
    throw new Error("L'annee doit etre entre 1900 et 2100");
  }
}
