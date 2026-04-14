import challengeData from "../../data/numerology/Basique/ChallengeData.json";
import {
  reduceToSingleDigit,
  validateDay,
  validateMonth,
  validateYear
} from "./utils";

interface ChallengeNumbersResult {
  first: { number: number; description: string };
  second: { number: number; description: string };
  third: { number: number; description: string };
  fourth: { number: number; description: string };
}

interface LifeCyclesResult {
  firstCycle: number;
  secondCycle: number;
  thirdCycle: number;
}

interface RealizationPeriodsResult {
  firstPeriod: number;
  secondPeriod: number;
  thirdPeriod: number;
  fourthPeriod: number;
}

function getChallengeDescription(challengeNumber: number): string {
  const challengeInfo =
    challengeData[challengeNumber.toString() as keyof typeof challengeData];
  return challengeInfo?.description || "Defi inconnu";
}

export function calculateChallengeNumbers(
  day: number,
  month: number,
  year: number
): ChallengeNumbersResult {
  validateDay(day);
  validateMonth(month);
  validateYear(year);

  const dayReduced = reduceToSingleDigit(day, false);
  const monthReduced = reduceToSingleDigit(month, false);
  const yearReduced = reduceToSingleDigit(year, false);

  const first = Math.abs(dayReduced - monthReduced);
  const second = Math.abs(dayReduced - yearReduced);
  const third = Math.abs(monthReduced - yearReduced);
  const fourth = Math.abs(first - second);

  const numbers = [first, second, third, fourth].map((value) =>
    value === 0 ? 9 : reduceToSingleDigit(value, false)
  );

  return {
    first: {
      number: numbers[0],
      description: getChallengeDescription(numbers[0])
    },
    second: {
      number: numbers[1],
      description: getChallengeDescription(numbers[1])
    },
    third: {
      number: numbers[2],
      description: getChallengeDescription(numbers[2])
    },
    fourth: {
      number: numbers[3],
      description: getChallengeDescription(numbers[3])
    }
  };
}

export function calculateLifeCycles(
  day: number,
  month: number,
  year: number
): LifeCyclesResult {
  const monthReduced = reduceToSingleDigit(month, false);
  const dayReduced = reduceToSingleDigit(day, false);
  const yearReduced = reduceToSingleDigit(
    year
      .toString()
      .split("")
      .reduce((acc, value) => acc + parseInt(value, 10), 0),
    false
  );

  return {
    firstCycle: monthReduced,
    secondCycle: dayReduced,
    thirdCycle: yearReduced
  };
}

export function calculateRealizationPeriods(
  day: number,
  month: number,
  year: number
): RealizationPeriodsResult {
  const dayReduced = reduceToSingleDigit(day, false);
  const monthReduced = reduceToSingleDigit(month, false);
  const yearReduced = reduceToSingleDigit(
    year
      .toString()
      .split("")
      .reduce((acc, value) => acc + parseInt(value, 10), 0),
    false
  );

  const firstPeriod = reduceToSingleDigit(dayReduced + monthReduced, false);
  const secondPeriod = reduceToSingleDigit(dayReduced + yearReduced, false);
  const thirdPeriod = reduceToSingleDigit(firstPeriod + secondPeriod, false);
  const fourthPeriod = reduceToSingleDigit(monthReduced + yearReduced, false);

  return {
    firstPeriod,
    secondPeriod,
    thirdPeriod,
    fourthPeriod
  };
}
