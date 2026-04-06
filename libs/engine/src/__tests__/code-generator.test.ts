import { describe, it, expect } from "vitest";
import { generateShortCode } from "../code-generator.js";

const BASE62 = /^[a-zA-Z0-9]+$/;

describe("generateShortCode", () => {
  it("generates a code of default length (7)", () => {
    const code = generateShortCode();
    expect(code).toHaveLength(7);
  });

  it("generates a code of custom length", () => {
    expect(generateShortCode(4)).toHaveLength(4);
    expect(generateShortCode(12)).toHaveLength(12);
  });

  it("uses only valid base62 characters (a-z, A-Z, 0-9)", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateShortCode()).toMatch(BASE62);
    }
  });

  it("generates 100 unique codes (all different)", () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateShortCode()));
    expect(codes.size).toBe(100);
  });
});
