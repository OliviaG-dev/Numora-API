import { getLetterValue, normalizeName, reduceToSingleDigit } from "./utils";
import type { AddressVibrationInput, LocalityVibrationInput } from "./types";

function sumDigitsFromString(value: string): number {
  return value
    .split("")
    .filter((char) => char >= "0" && char <= "9")
    .reduce((acc, char) => acc + Number(char), 0);
}

function sumLettersPythagorean(value: string): number {
  const normalized = normalizeName(value).replace(/[^A-Z]/g, "");
  let sum = 0;
  for (const char of normalized) {
    sum += getLetterValue(char);
  }
  return sum;
}

export function calculateAddressVibration(input: AddressVibrationInput): number {
  const allowMasterNumbers = input.allowMasterNumbers ?? true;
  const numberSum = sumDigitsFromString(input.streetNumber);
  const streetSum = sumLettersPythagorean(input.streetName);
  return reduceToSingleDigit(numberSum + streetSum, allowMasterNumbers);
}

export function calculateLocalityVibration(input: LocalityVibrationInput): number {
  const allowMasterNumbers = input.allowMasterNumbers ?? true;
  const postalSum = sumDigitsFromString(input.postalCode);
  const citySum = sumLettersPythagorean(input.city);
  return reduceToSingleDigit(postalSum + citySum, allowMasterNumbers);
}
