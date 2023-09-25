import { describe, it, expect } from "@jest/globals";

import { isNullish } from "../src/general";

describe("isNullish", () => {
  describe.each([
    { value: null, expected: true, condition: "null" },
    { value: undefined, expected: true, condition: "undefined" },
    { value: 0, expected: false, condition: "0" },
    { value: false, expected: false, condition: "false" },
    { value: "", expected: false, condition: "empty string" },
    { value: [], expected: false, condition: "empty array" },
    { value: {}, expected: false, condition: "empty object" },
    { value: NaN, expected: false, condition: "NaN" },
    { value: Infinity, expected: false, condition: "Infinity" },
    { value: -Infinity, expected: false, condition: "-Infinity" },
    { value: () => {}, expected: false, condition: "function" },
    { value: class Test {}, expected: false, condition: "class" },
    { value: new (class Test {})(), expected: false, condition: "class instance" },
  ])(`when provided %s`, ({ value, expected, condition }) => {
    it(`returns ${expected} for ${condition}`, () => {
      expect(isNullish(value)).toBe(expected);
    });
  });
});
