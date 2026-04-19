import { describe, expect, it } from "vitest";

import {
  calculateAddressVibration,
  calculateLocalityVibration
} from "../src/modules/numerology/place";

describe("place vibrations", () => {
  it("combines street number digits and street name letters", () => {
    const value = calculateAddressVibration({
      streetNumber: "12",
      streetName: "Rue de Paris"
    });
    expect(typeof value).toBe("number");
    expect(value).toBeGreaterThanOrEqual(1);
  });

  it("accepts explicit allowMasterNumbers on address", () => {
    const value = calculateAddressVibration({
      streetNumber: "10",
      streetName: "Rue Zen",
      allowMasterNumbers: false
    });
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(9);
  });

  it("combines postal digits and city letters", () => {
    const value = calculateLocalityVibration({
      postalCode: "75001",
      city: "Paris"
    });
    expect(typeof value).toBe("number");
    expect(value).toBeGreaterThanOrEqual(1);
  });

  it("accepts explicit allowMasterNumbers on locality", () => {
    const value = calculateLocalityVibration({
      postalCode: "75001",
      city: "Paris",
      allowMasterNumbers: false
    });
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(9);
  });
});
