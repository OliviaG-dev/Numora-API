import { calculateLifePathNumber } from "../numerology/core";
import { reduceToSingleDigit } from "../numerology/utils";

export interface SephirothValues {
  kether: number;
  chokhmah: number;
  binah: number;
  chesed: number;
  gevurah: number;
  tipheret: number;
  netzach: number;
  hod: number;
  yesod: number;
  malkuth: number;
}

export interface TreePath {
  from: string;
  to: string;
  number: number;
  arcana?: string;
}

export const TREE_PATHS: TreePath[] = [
  { from: "chokhmah", to: "binah", number: 1, arcana: "Le Bateleur" },
  { from: "chesed", to: "gevurah", number: 6, arcana: "L'Amoureux" },
  { from: "netzach", to: "hod", number: 15, arcana: "Le Diable" },
  { from: "kether", to: "chokhmah", number: 2, arcana: "La Papesse" },
  { from: "chokhmah", to: "chesed", number: 7, arcana: "Le Chariot" },
  { from: "chesed", to: "netzach", number: 10, arcana: "La Roue de Fortune" },
  { from: "netzach", to: "yesod", number: 18, arcana: "La Lune" },
  { from: "kether", to: "binah", number: 3, arcana: "L'Imperatrice" },
  { from: "binah", to: "gevurah", number: 8, arcana: "La Justice" },
  { from: "gevurah", to: "hod", number: 11, arcana: "La Force" },
  { from: "hod", to: "yesod", number: 19, arcana: "Le Soleil" },
  { from: "kether", to: "tipheret", number: 4, arcana: "L'Empereur" },
  { from: "tipheret", to: "yesod", number: 13, arcana: "La Mort" },
  { from: "yesod", to: "malkuth", number: 21, arcana: "Le Monde" },
  { from: "chokhmah", to: "tipheret", number: 5, arcana: "Le Pape" },
  { from: "binah", to: "tipheret", number: 9, arcana: "L'Hermite" },
  { from: "chesed", to: "tipheret", number: 12, arcana: "Le Pendu" },
  { from: "gevurah", to: "tipheret", number: 14, arcana: "Temperance" },
  { from: "tipheret", to: "netzach", number: 16, arcana: "La Maison Dieu" },
  { from: "tipheret", to: "hod", number: 17, arcana: "L'Etoile" },
  { from: "netzach", to: "malkuth", number: 20, arcana: "Le Jugement" },
  { from: "hod", to: "malkuth", number: 22, arcana: "Le Mat" }
];

export interface PillarBalance {
  mercy: number;
  severity: number;
  equilibrium: number;
}

export interface TreeOfLifeAnalysis {
  sephirothValues: SephirothValues;
  significantPaths: Array<{ path: TreePath; value: number }>;
  pillarBalance: PillarBalance;
  dominantPillar: "mercy" | "severity" | "equilibrium";
}

export function calculateSephirothValues(birthDate: string): SephirothValues {
  const [year, month, day] = birthDate.split("-").map(Number);
  const allDigits = birthDate.replace(/-/g, "").split("").map(Number);
  const totalSum = allDigits.reduce((acc, value) => acc + value, 0);

  return {
    kether: calculateLifePathNumber(birthDate),
    chokhmah: reduceToSingleDigit(year),
    binah: reduceToSingleDigit(month),
    chesed: reduceToSingleDigit(day),
    gevurah: reduceToSingleDigit(day + month),
    tipheret: calculateLifePathNumber(birthDate),
    netzach: reduceToSingleDigit(day + year),
    hod: reduceToSingleDigit(month + year),
    yesod: reduceToSingleDigit(totalSum),
    malkuth: reduceToSingleDigit(day + month + year)
  };
}

export function calculatePathValue(values: SephirothValues, path: TreePath): number {
  const fromValue = values[path.from as keyof SephirothValues];
  const toValue = values[path.to as keyof SephirothValues];
  return reduceToSingleDigit(fromValue + toValue);
}

export function getSignificantPaths(
  values: SephirothValues,
  topN: number = 5
): Array<{ path: TreePath; value: number }> {
  const pathsWithValues = TREE_PATHS.map((path) => ({
    path,
    value: calculatePathValue(values, path)
  }));

  return pathsWithValues.sort((a, b) => b.value - a.value).slice(0, topN);
}

export function calculatePillarBalance(values: SephirothValues): PillarBalance {
  const mercy = reduceToSingleDigit(values.chokhmah + values.chesed + values.netzach);
  const severity = reduceToSingleDigit(values.binah + values.gevurah + values.hod);
  const equilibrium = reduceToSingleDigit(
    values.kether + values.tipheret + values.yesod + values.malkuth
  );

  return {
    mercy,
    severity,
    equilibrium
  };
}

export function analyzeTreeOfLife(birthDate: string): TreeOfLifeAnalysis {
  const sephirothValues = calculateSephirothValues(birthDate);
  const significantPaths = getSignificantPaths(sephirothValues);
  const pillarBalance = calculatePillarBalance(sephirothValues);

  let dominantPillar: "mercy" | "severity" | "equilibrium" = "equilibrium";
  if (
    pillarBalance.mercy > pillarBalance.severity &&
    pillarBalance.mercy > pillarBalance.equilibrium
  ) {
    dominantPillar = "mercy";
  } else if (
    pillarBalance.severity > pillarBalance.mercy &&
    pillarBalance.severity > pillarBalance.equilibrium
  ) {
    dominantPillar = "severity";
  }

  return {
    sephirothValues,
    significantPaths,
    pillarBalance,
    dominantPillar
  };
}
