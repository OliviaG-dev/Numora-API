import { reduceToSingleDigit } from "../numerology/utils";

/**
 * Matrix Destiny — aligné sur Numora (frontend web) :
 * `Numora/src/utils/matrixDestiny/matrixDestiny.ts`
 */

export interface MatrixDestiny {
  base: {
    day: number;
    month: number;
    year: number;
    lifeMission: number;
  };
  center: {
    mission: number;
    maleLine: {
      dayMonth: number;
      mission: number;
      dayYear: number;
    };
    femaleLine: {
      monthYear: number;
      mission: number;
      monthDay: number;
    };
  };
  chakras: Record<string, { physique: number; energy: number; emotions: number }>;
  cycles: Record<string, number>;
  special: {
    love: number;
    money: number;
    balance: number;
  };
  commonEnergyZone: {
    physics: number;
    energy: number;
    emotions: number;
  };
  heartLine: {
    physique: number;
    energy: number;
    emotions: number;
  };
  karmicLines: {
    financialKarmicTail: { primary: number; secondary: number };
    karmicLife: { primary: number; secondary: number };
    talentZone: { primary: number; secondary: number };
    socialConnection: number;
    parents: { primary: number; secondary: number };
    feminineAncestry: {
      primary: number;
      secondary: number;
      tertiary: number;
      quaternary: number;
    };
    masculineAncestry: {
      primary: number;
      secondary: number;
      tertiary: number;
      quaternary: number;
    };
  };
  externalRelations: {
    personalPower: number;
    socialInfluence: number;
  };
}

function reduceToMatrixNumber(n: number): number {
  while (n > 22) {
    n = n
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b, 10), 0);
  }
  return n === 0 ? 22 : n;
}

function sumReduce(...nums: number[]): number {
  const total = nums.reduce((a, b) => a + b, 0);
  return reduceToMatrixNumber(total);
}

function calculateLifeMission(
  dayValue: number,
  monthValue: number,
  yearValue: number
): number {
  const baseSum = dayValue + monthValue + yearValue;
  return reduceToMatrixNumber(baseSum);
}

function calculateMaleLine(
  day: number,
  month: number,
  year: number,
  mission: number,
  lifeMission: number
): {
  dayMonth: number;
  mission: number;
  dayYear: number;
} {
  return {
    dayMonth: reduceToMatrixNumber(day + month),
    mission,
    dayYear: reduceToMatrixNumber(year + lifeMission)
  };
}

function calculateFemaleLine(
  day: number,
  month: number,
  year: number,
  mission: number,
  lifeMission: number
): {
  monthYear: number;
  mission: number;
  monthDay: number;
} {
  return {
    monthYear: reduceToMatrixNumber(month + year),
    mission,
    monthDay: reduceToMatrixNumber(lifeMission + day)
  };
}

function calculateHeartLine(
  parentsPrimary: number,
  maleLineMission: number,
  talentZonePrimary: number
): { physique: number; energy: number; emotions: number } {
  const physique = reduceToMatrixNumber(parentsPrimary + maleLineMission);
  const energy = reduceToMatrixNumber(maleLineMission + talentZonePrimary);
  const emotions = reduceToMatrixNumber(physique + energy);
  return { physique, energy, emotions };
}

function calculateChakrasTraditional(
  day: number,
  month: number,
  year: number,
  dayValue: number,
  monthValue: number,
  parentsSecondary: number,
  talentZoneSecondary: number,
  parentsPrimary: number,
  talentZonePrimary: number,
  maleLineMission: number,
  financialKarmicTailPrimary: number,
  karmicLifePrimary: number,
  yearValue: number,
  lifeMission: number,
  heartLine: { physique: number; energy: number; emotions: number }
): Record<string, { physique: number; energy: number; emotions: number }> {
  return {
    sahasrara: {
      physique: dayValue,
      energy: monthValue,
      emotions: reduceToMatrixNumber(monthValue + dayValue)
    },
    ajna: {
      physique: reduceToMatrixNumber((day * month) % 22),
      energy: reduceToMatrixNumber((month * year) % 22),
      emotions: reduceToMatrixNumber(parentsSecondary + talentZoneSecondary)
    },
    vissudha: {
      physique: reduceToMatrixNumber((day + month + year) % 22),
      energy: reduceToMatrixNumber((day * 2 + month) % 22),
      emotions: reduceToMatrixNumber(parentsPrimary + talentZonePrimary)
    },
    anahata: {
      physique: heartLine.physique,
      energy: heartLine.energy,
      emotions: heartLine.emotions
    },
    manipura: {
      physique: Math.floor(day / 2) + Math.floor(month / 2),
      energy: Math.floor(month / 2) + Math.floor(year / 200),
      emotions: reduceToMatrixNumber(maleLineMission + maleLineMission)
    },
    svadhisthana: {
      physique: reduceToMatrixNumber((day * 3) % 22),
      energy: reduceToMatrixNumber((month * 3) % 22),
      emotions: reduceToMatrixNumber(financialKarmicTailPrimary + karmicLifePrimary)
    },
    muladhara: {
      physique: reduceToMatrixNumber(day % 22),
      energy: reduceToMatrixNumber(month % 22),
      emotions: reduceToMatrixNumber(yearValue + lifeMission)
    }
  };
}

function calculateAgeCycles(day: number, month: number, year: number): Record<string, number> {
  const cycles: Record<string, number> = {};
  const baseCycle = day + month + (year % 100);

  for (let age = 0; age <= 75; age += 5) {
    const cycleValue = reduceToMatrixNumber(baseCycle + age);
    cycles[age.toString()] = cycleValue;

    if (age > 0) {
      const subPeriod1 = reduceToMatrixNumber(cycleValue + 1);
      const subPeriod2 = reduceToMatrixNumber(cycleValue + 2);
      cycles[`${age}-${age + 2.5}`] = subPeriod1;
      cycles[`${age + 2.5}-${age + 5}`] = subPeriod2;
    }
  }

  return cycles;
}

function calculateSpecialDomainsTraditional(
  day: number,
  month: number,
  year: number,
  karmicLifePrimary?: number,
  masculineAncestryTertiary?: number,
  financialKarmicTailPrimary?: number
): { love: number; money: number; balance: number } {
  const balance =
    masculineAncestryTertiary || reduceToMatrixNumber(day + month);

  const money = financialKarmicTailPrimary
    ? reduceToMatrixNumber(balance + financialKarmicTailPrimary)
    : reduceToMatrixNumber((month * year) % 22);

  const love =
    karmicLifePrimary && masculineAncestryTertiary
      ? reduceToMatrixNumber(karmicLifePrimary + masculineAncestryTertiary)
      : reduceToMatrixNumber((day * month) % 22);

  return { love, money, balance };
}

function calculateCommonEnergyZone(
  chakras: Record<string, { physique: number; energy: number; emotions: number }>
): { physics: number; energy: number; emotions: number } {
  const totalPhysics = Object.values(chakras).reduce((sum, chakra) => sum + chakra.physique, 0);
  const totalEnergy = Object.values(chakras).reduce((sum, chakra) => sum + chakra.energy, 0);
  const totalEmotions = Object.values(chakras).reduce((sum, chakra) => sum + chakra.emotions, 0);

  return {
    physics: reduceToMatrixNumber(totalPhysics),
    energy: reduceToMatrixNumber(totalEnergy),
    emotions: reduceToMatrixNumber(totalEmotions)
  };
}

function calculateKarmicLines(
  month: number,
  year: number,
  lifeMission: number,
  maleLineMission: number,
  yearValue: number,
  monthValue: number,
  dayValue: number,
  maleLineDayMonth: number,
  maleLineDayYear: number,
  parentsPrimary: number,
  karmicLifePrimary: number,
  talentZonePrimary: number,
  femaleLineMonthYear: number,
  femaleLineMonthDay: number
): MatrixDestiny["karmicLines"] {
  const financialPrimary = reduceToMatrixNumber(maleLineMission + yearValue);
  const financialSecondary = reduceToMatrixNumber(financialPrimary + yearValue);

  const karmicLifeSecondary = reduceToMatrixNumber(karmicLifePrimary + lifeMission);

  const talentZoneSecondary = reduceToMatrixNumber(talentZonePrimary + monthValue);

  const parentsSecondary = reduceToMatrixNumber(parentsPrimary + dayValue);

  return {
    financialKarmicTail: {
      primary: financialPrimary,
      secondary: financialSecondary
    },
    karmicLife: {
      primary: karmicLifePrimary,
      secondary: karmicLifeSecondary
    },
    talentZone: {
      primary: talentZonePrimary,
      secondary: talentZoneSecondary
    },
    socialConnection: reduceToMatrixNumber((month + year) % 22),
    parents: {
      primary: parentsPrimary,
      secondary: parentsSecondary
    },
    feminineAncestry: {
      primary: reduceToMatrixNumber(financialPrimary + talentZonePrimary),
      secondary: reduceToMatrixNumber(
        reduceToMatrixNumber(financialPrimary + talentZonePrimary) + femaleLineMonthYear
      ),
      tertiary: reduceToMatrixNumber(parentsPrimary + karmicLifePrimary),
      quaternary: reduceToMatrixNumber(
        reduceToMatrixNumber(parentsPrimary + karmicLifePrimary) + femaleLineMonthDay
      )
    },
    masculineAncestry: {
      primary: reduceToMatrixNumber(parentsPrimary + talentZonePrimary),
      secondary: reduceToMatrixNumber(
        maleLineDayMonth + reduceToMatrixNumber(parentsPrimary + talentZonePrimary)
      ),
      tertiary: reduceToMatrixNumber(financialPrimary + karmicLifePrimary),
      quaternary: reduceToMatrixNumber(financialPrimary + karmicLifePrimary + maleLineDayYear)
    }
  };
}

function calculateExternalRelations(
  maleLineMission: number,
  centerMission: number
): { personalPower: number; socialInfluence: number } {
  let personalPower: number;
  if (centerMission <= 9) {
    personalPower = centerMission * 2;
  } else if (centerMission >= 10) {
    const centerSum = centerMission
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    personalPower = centerMission + centerSum;
  } else {
    personalPower = centerMission;
  }

  personalPower = reduceToMatrixNumber(personalPower);

  const socialInfluence = reduceToMatrixNumber(personalPower + maleLineMission);

  return {
    personalPower,
    socialInfluence
  };
}

export function calculateMatrixDestiny(day: number, month: number, year: number): MatrixDestiny {
  const dayValue = reduceToMatrixNumber(day);
  const monthValue = reduceToMatrixNumber(month);
  const yearValue = reduceToMatrixNumber(year);
  const lifeMission = calculateLifeMission(dayValue, monthValue, yearValue);

  const centerMission = sumReduce(dayValue, monthValue, yearValue, lifeMission);

  const maleLine = calculateMaleLine(day, month, year, centerMission, lifeMission);
  const femaleLine = calculateFemaleLine(day, month, year, centerMission, lifeMission);

  const parentsPrimary = reduceToMatrixNumber(maleLine.mission + dayValue);
  const talentZonePrimary = reduceToMatrixNumber(maleLine.mission + monthValue);
  const parentsSecondary = reduceToMatrixNumber(maleLine.mission + dayValue + dayValue);
  const talentZoneSecondary = reduceToMatrixNumber(maleLine.mission + monthValue + monthValue);
  const financialKarmicTailPrimary = reduceToMatrixNumber(maleLine.mission + yearValue);
  const karmicLifePrimary = reduceToMatrixNumber(maleLine.mission + lifeMission);

  const heartLine = calculateHeartLine(parentsPrimary, maleLine.mission, talentZonePrimary);

  const chakras = calculateChakrasTraditional(
    day,
    month,
    year,
    dayValue,
    monthValue,
    parentsSecondary,
    talentZoneSecondary,
    parentsPrimary,
    talentZonePrimary,
    maleLine.mission,
    financialKarmicTailPrimary,
    karmicLifePrimary,
    yearValue,
    lifeMission,
    heartLine
  );

  const cycles = calculateAgeCycles(day, month, year);

  const karmicLines = calculateKarmicLines(
    month,
    year,
    lifeMission,
    maleLine.mission,
    yearValue,
    monthValue,
    dayValue,
    maleLine.dayMonth,
    maleLine.dayYear,
    parentsPrimary,
    karmicLifePrimary,
    talentZonePrimary,
    femaleLine.monthYear,
    femaleLine.monthDay
  );

  const special = calculateSpecialDomainsTraditional(
    day,
    month,
    year,
    karmicLifePrimary,
    karmicLines.masculineAncestry.tertiary,
    financialKarmicTailPrimary
  );

  const externalRelations = calculateExternalRelations(maleLine.mission, centerMission);

  const commonEnergyZone = calculateCommonEnergyZone(chakras);

  return {
    base: {
      day: dayValue,
      month: monthValue,
      year: yearValue,
      lifeMission
    },
    center: {
      mission: centerMission,
      maleLine,
      femaleLine
    },
    chakras,
    cycles,
    special,
    commonEnergyZone,
    heartLine,
    karmicLines,
    externalRelations
  };
}

export function reduceNumber(value: number): number {
  return reduceToSingleDigit(value, true);
}
