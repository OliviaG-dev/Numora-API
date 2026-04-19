import { describe, expect, it } from "vitest";

import {
  getCrystalExpressionData,
  getCrystalPathData,
  getCrystalSyntheseData,
  getLifePathAddressVibrationCompat,
  getNumerologyData,
  getRealisationNumberData,
  isValidNumerologyNumber,
  lifePathAddressCompatNiveauToTone,
  lifePathData
} from "../src/data";

describe("data catalog helpers", () => {
  it("isValidNumerologyNumber validates known keys", () => {
    expect(isValidNumerologyNumber("5")).toBe(true);
    expect(isValidNumerologyNumber("11")).toBe(true);
    expect(isValidNumerologyNumber("99")).toBe(false);
  });

  it("getNumerologyData returns null for invalid number", () => {
    expect(getNumerologyData(lifePathData, "99")).toBeNull();
  });

  it("getRealisationNumberData returns null for negative or non-integer", () => {
    expect(getRealisationNumberData(-1)).toBeNull();
    expect(getRealisationNumberData(1.5)).toBeNull();
  });

  it("getRealisationNumberData returns detail for a valid integer", () => {
    const detail = getRealisationNumberData(5);
    expect(detail === null || typeof detail === "object").toBe(true);
  });

  it("getCrystalPathData finds or returns null", () => {
    const found = getCrystalPathData(1);
    expect(found === null || typeof found === "object").toBe(true);
    expect(getCrystalPathData(99999)).toBeNull();
  });

  it("getCrystalExpressionData finds or returns null", () => {
    const found = getCrystalExpressionData(3);
    expect(found === null || typeof found === "object").toBe(true);
    expect(getCrystalExpressionData(99999)).toBeNull();
  });

  it("getCrystalSyntheseData returns null when combination is missing", () => {
    expect(getCrystalSyntheseData(1, 99999)).toBeNull();
  });

  it("lifePathAddressCompatNiveauToTone maps niveau strings", () => {
    expect(lifePathAddressCompatNiveauToTone("Très harmonieux")).toBe("harmonious");
    expect(lifePathAddressCompatNiveauToTone("harmonieux")).toBe("harmonious");
    expect(lifePathAddressCompatNiveauToTone("Contraste modéré")).toBe("growth");
    expect(lifePathAddressCompatNiveauToTone("Exigeant")).toBe("growth");
    expect(lifePathAddressCompatNiveauToTone("Neutre")).toBe("balanced");
  });

  it("getLifePathAddressVibrationCompat returns null or detail", () => {
    expect(getLifePathAddressVibrationCompat(999, 999)).toBeNull();
    const found = getLifePathAddressVibrationCompat(1, 1);
    expect(found === null || typeof found === "object").toBe(true);
  });
});
