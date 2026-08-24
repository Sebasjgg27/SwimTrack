import { describe, expect, it } from "vitest";

import {
  calculateCSS,
  calculateZones,
  formatPace,
  parseTime,
} from "./utils";

describe("swim time parsing", () => {
  it("parses minute, second, and centisecond input", () => {
    expect(parseTime("4:32.15")).toBe(272_150);
  });

  it("parses second and centisecond input", () => {
    expect(parseTime("52.34")).toBe(52_340);
  });

  it("rejects malformed or out-of-range input", () => {
    expect(parseTime("not-a-time")).toBe(0);
    expect(parseTime("1:75.00")).toBe(0);
    expect(parseTime("-2:08.45")).toBe(0);
  });
});

describe("critical swim speed", () => {
  it("returns seconds per 100 metres from 400m and 200m trials", () => {
    expect(calculateCSS(272_150, 128_450)).toBeCloseTo(71.85, 5);
  });

  it("rejects trials where the 400m time is not slower than two 200m efforts", () => {
    expect(calculateCSS(240_000, 120_000)).toBe(0);
    expect(calculateCSS(230_000, 120_000)).toBe(0);
  });

  it("builds training zones around the CSS pace", () => {
    expect(calculateZones(71.85)).toEqual({
      css: 71.85,
      a1: { min: 91.85, max: 101.85 },
      a2: { min: 81.85, max: 91.85 },
      a3: { min: 66.85, max: 76.85 },
      vo2: { min: 61.85, max: 66.85 },
      tolerance: { min: 56.85, max: 61.85 },
      allOut: 56.85,
    });
  });
});

describe("pace formatting", () => {
  it("formats rounded centiseconds without floating-point truncation", () => {
    expect(formatPace(71.85)).toBe("1:11.85");
    expect(formatPace(59.999)).toBe("1:00.00");
  });
});
