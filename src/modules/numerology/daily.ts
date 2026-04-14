function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

export function calculateDayVibration(day: number): number {
  return reduceToSingleDigit(day);
}

export function calculateMonthVibration(month: number): number {
  return reduceToSingleDigit(month);
}

export function getUniversalYear(date: Date): number {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return month >= 10 ? year + 1 : year;
}

export function calculateYearVibration(date: Date): number {
  const universalYear = getUniversalYear(date);
  return reduceToSingleDigit(universalYear);
}

export function calculateUniversalVibration(date: Date): number {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const universalYear = getUniversalYear(date);
  const sum = day + month + universalYear;
  return reduceToSingleDigit(sum);
}

export function calculateAllVibrations(date: Date = new Date()): {
  day: number;
  month: number;
  year: number;
  universal: number;
} {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return {
    day: calculateDayVibration(day),
    month: calculateMonthVibration(month),
    year: calculateYearVibration(date),
    universal: calculateUniversalVibration(date)
  };
}
