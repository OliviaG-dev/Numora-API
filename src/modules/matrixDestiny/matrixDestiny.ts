import { reduceToSingleDigit } from "../numerology/utils";

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

function reduceToMatrixNumber(value: number): number {
  while (value > 22) {
    value = value
      .toString()
      .split("")
      .reduce((acc, digit) => acc + Number(digit), 0);
  }
  return value === 0 ? 22 : value;
}

export function calculateMatrixDestiny(
  day: number,
  month: number,
  year: number
): MatrixDestiny {
  const dayValue = reduceToMatrixNumber(day);
  const monthValue = reduceToMatrixNumber(month);
  const yearValue = reduceToMatrixNumber(year);
  const lifeMission = reduceToMatrixNumber(dayValue + monthValue + yearValue);
  const centerMission = reduceToMatrixNumber(
    dayValue + monthValue + yearValue + lifeMission
  );

  const maleLine = {
    dayMonth: reduceToMatrixNumber(dayValue + monthValue),
    mission: centerMission,
    dayYear: reduceToMatrixNumber(yearValue + lifeMission)
  };

  const femaleLine = {
    monthYear: reduceToMatrixNumber(monthValue + yearValue),
    mission: centerMission,
    monthDay: reduceToMatrixNumber(lifeMission + dayValue)
  };

  const chakras = {
    sahasrara: {
      physique: dayValue,
      energy: monthValue,
      emotions: reduceToMatrixNumber(dayValue + monthValue)
    },
    ajna: {
      physique: reduceToMatrixNumber(day * month),
      energy: reduceToMatrixNumber(month * yearValue),
      emotions: reduceToMatrixNumber(dayValue + yearValue)
    },
    vissudha: {
      physique: reduceToMatrixNumber(dayValue + monthValue + yearValue),
      energy: reduceToMatrixNumber(dayValue * 2 + monthValue),
      emotions: reduceToMatrixNumber(maleLine.dayMonth + femaleLine.monthYear)
    },
    anahata: {
      physique: reduceToMatrixNumber(dayValue + centerMission),
      energy: reduceToMatrixNumber(centerMission + monthValue),
      emotions: reduceToMatrixNumber(dayValue + monthValue + centerMission)
    },
    manipura: {
      physique: reduceToMatrixNumber(Math.floor(day / 2) + Math.floor(month / 2)),
      energy: reduceToMatrixNumber(Math.floor(month / 2) + Math.floor(year / 200)),
      emotions: reduceToMatrixNumber(centerMission + centerMission)
    },
    svadhisthana: {
      physique: reduceToMatrixNumber(day * 3),
      energy: reduceToMatrixNumber(month * 3),
      emotions: reduceToMatrixNumber(yearValue + lifeMission)
    },
    muladhara: {
      physique: reduceToMatrixNumber(day),
      energy: reduceToMatrixNumber(month),
      emotions: reduceToMatrixNumber(yearValue + lifeMission)
    }
  };

  const cycles: Record<string, number> = {};
  const baseCycle = day + month + (year % 100);
  for (let age = 0; age <= 75; age += 5) {
    cycles[age.toString()] = reduceToMatrixNumber(baseCycle + age);
  }

  const financialPrimary = reduceToMatrixNumber(centerMission + yearValue);
  const financialSecondary = reduceToMatrixNumber(financialPrimary + yearValue);
  const karmicPrimary = reduceToMatrixNumber(centerMission + lifeMission);
  const karmicSecondary = reduceToMatrixNumber(karmicPrimary + lifeMission);
  const talentPrimary = reduceToMatrixNumber(centerMission + monthValue);
  const talentSecondary = reduceToMatrixNumber(talentPrimary + monthValue);
  const parentsPrimary = reduceToMatrixNumber(centerMission + dayValue);
  const parentsSecondary = reduceToMatrixNumber(parentsPrimary + dayValue);

  const karmicLines = {
    financialKarmicTail: { primary: financialPrimary, secondary: financialSecondary },
    karmicLife: { primary: karmicPrimary, secondary: karmicSecondary },
    talentZone: { primary: talentPrimary, secondary: talentSecondary },
    socialConnection: reduceToMatrixNumber(month + year),
    parents: { primary: parentsPrimary, secondary: parentsSecondary },
    feminineAncestry: {
      primary: reduceToMatrixNumber(financialPrimary + talentPrimary),
      secondary: reduceToMatrixNumber(
        reduceToMatrixNumber(financialPrimary + talentPrimary) + femaleLine.monthYear
      ),
      tertiary: reduceToMatrixNumber(parentsPrimary + karmicPrimary),
      quaternary: reduceToMatrixNumber(
        reduceToMatrixNumber(parentsPrimary + karmicPrimary) + femaleLine.monthDay
      )
    },
    masculineAncestry: {
      primary: reduceToMatrixNumber(parentsPrimary + talentPrimary),
      secondary: reduceToMatrixNumber(
        maleLine.dayMonth + reduceToMatrixNumber(parentsPrimary + talentPrimary)
      ),
      tertiary: reduceToMatrixNumber(financialPrimary + karmicPrimary),
      quaternary: reduceToMatrixNumber(financialPrimary + karmicPrimary + maleLine.dayYear)
    }
  };

  const special = {
    love: reduceToMatrixNumber(karmicLines.karmicLife.primary + karmicLines.masculineAncestry.tertiary),
    money: reduceToMatrixNumber(karmicLines.masculineAncestry.tertiary + financialPrimary),
    balance: reduceToMatrixNumber(dayValue + monthValue)
  };

  const totalPhysics = Object.values(chakras).reduce(
    (sum, chakra) => sum + chakra.physique,
    0
  );
  const totalEnergy = Object.values(chakras).reduce(
    (sum, chakra) => sum + chakra.energy,
    0
  );
  const totalEmotions = Object.values(chakras).reduce(
    (sum, chakra) => sum + chakra.emotions,
    0
  );

  const commonEnergyZone = {
    physics: reduceToMatrixNumber(totalPhysics),
    energy: reduceToMatrixNumber(totalEnergy),
    emotions: reduceToMatrixNumber(totalEmotions)
  };

  const personalPower = reduceToMatrixNumber(
    centerMission <= 9
      ? centerMission * 2
      : centerMission +
          centerMission
            .toString()
            .split("")
            .reduce((sum, digit) => sum + Number(digit), 0)
  );

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
    karmicLines,
    externalRelations: {
      personalPower,
      socialInfluence: reduceToMatrixNumber(personalPower + centerMission)
    }
  };
}

export function reduceNumber(value: number): number {
  return reduceToSingleDigit(value, true);
}
