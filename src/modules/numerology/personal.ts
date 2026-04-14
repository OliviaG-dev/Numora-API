import { getUniversalYear } from "./daily";
import { reduceToSingleDigit, validateDay, validateMonth } from "./utils";
import type { PersonalNumbersResult } from "./types";

export function calculatePersonalYear(
  day: number,
  month: number,
  date: Date
): number {
  validateDay(day);
  validateMonth(month);

  const universalYear = getUniversalYear(date);
  const yearReduced = reduceToSingleDigit(universalYear, false);
  const sum = day + month + yearReduced;
  return reduceToSingleDigit(sum, false);
}

export function calculatePersonalMonth(
  personalYear: number,
  month: number
): number {
  validateMonth(month);
  const sum = personalYear + month;
  return reduceToSingleDigit(sum, false);
}

export function calculatePersonalDay(personalMonth: number, day: number): number {
  validateDay(day);
  const sum = personalMonth + day;
  return reduceToSingleDigit(sum, false);
}

export function calculatePersonalNumbers(
  birthDay: number,
  birthMonth: number,
  currentDate?: Date
): PersonalNumbersResult {
  const today = currentDate || new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const personalYear = calculatePersonalYear(birthDay, birthMonth, today);
  const personalMonth = calculatePersonalMonth(personalYear, currentMonth);
  const personalDay = calculatePersonalDay(personalMonth, currentDay);

  return {
    year: {
      number: personalYear,
      description: `Annee personnelle ${personalYear}`
    },
    month: {
      number: personalMonth,
      description: `Mois personnel ${personalMonth}`
    },
    day: {
      number: personalDay,
      description: `Jour personnel ${personalDay}`
    }
  };
}
