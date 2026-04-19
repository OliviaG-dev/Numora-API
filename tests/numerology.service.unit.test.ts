import { describe, expect, it } from "vitest";

import {
  calculateNumerologyProfile,
  getNumerologyDataset,
  getNumerologyDatasetEntry,
  listNumerologyDatasets
} from "../src/services/numerology.service";

describe("numerology.service", () => {
  it("listNumerologyDatasets returns sorted ids", () => {
    const list = listNumerologyDatasets();
    expect(list.length).toBeGreaterThan(0);
    const ids = list.map((d) => d.id);
    expect([...ids].sort((a, b) => a.localeCompare(b))).toEqual(ids);
  });

  it("getNumerologyDataset returns null for unknown id", () => {
    expect(getNumerologyDataset("datasetThatDoesNotExist")).toBeNull();
  });

  it("getNumerologyDatasetEntry returns null for unknown dataset", () => {
    expect(getNumerologyDatasetEntry("missing", "1")).toBeNull();
  });

  it("getNumerologyDatasetEntry rejects non-integer array index", () => {
    expect(getNumerologyDatasetEntry("crystalPathData", "1.5")).toBeNull();
  });

  it("getNumerologyDatasetEntry rejects negative array index", () => {
    expect(getNumerologyDatasetEntry("crystalPathData", "-1")).toBeNull();
  });

  it("getNumerologyDatasetEntry rejects non-numeric array index", () => {
    expect(getNumerologyDatasetEntry("crystalPathData", "abc")).toBeNull();
  });

  it("throws when birthDate parts are not numeric", () => {
    expect(() =>
      calculateNumerologyProfile({
        fullName: "Marie Dupont",
        birthDate: "1990-xx-15" as unknown as string
      })
    ).toThrow('Format de birthDate invalide');
  });

  it("throws when referenceDate is invalid calendar value", () => {
    expect(() =>
      calculateNumerologyProfile({
        fullName: "Marie Dupont",
        birthDate: "1990-03-15",
        referenceDate: "2400-99-99"
      })
    ).toThrow("referenceDate");
  });

  it("includes place vibrations when address and locality are set", () => {
    const result = calculateNumerologyProfile({
      fullName: "Marie Dupont",
      birthDate: "1990-03-15",
      address: { streetNumber: "10", streetName: "Rue Zen" },
      locality: { postalCode: "75001", city: "Paris" }
    });

    expect(result.place.addressVibration).toBeDefined();
    expect(result.place.localityVibration).toBeDefined();
  });
});
