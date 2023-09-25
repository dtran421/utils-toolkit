import { describe, expect, it } from "@jest/globals";

import { Option, Result } from "../src/return-types";
import { TestError } from "./stubs";

describe("Result", () => {
  describe("when provided value", () => {
    const result = Result<string, Error>("test");

    it(`identifies itself as ok`, () => {
      expect(result.ok).toBe(true);
    });

    it("unwraps its value", () => {
      expect(result.unwrap()).toBe("test");
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in result).toBe(true);
      expect(() => result.ok && result.value).toThrowError("cannot access result directly, use `unwrap()` instead!");
      expect("error" in result).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(result.toString()).toBe("Ok(test)");
    });
  });

  describe.each([
    {
      result: Result<Option<string>, Error>(Option<string>(null)),
      condition: "an Option containing null",
    },
    {
      result: Result<Option<string>, Error>(Option<string>(undefined)),
      condition: "an Option containing undefined",
    },
  ])("when provided $condition", ({ result }) => {
    it(`identifies itself as ok`, () => {
      expect(result.ok).toBe(true);
    });

    it("unwraps its value", () => {
      expect(result.ok && result.unwrap().coalesce()).toBe(null);
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in result).toBe(true);
      expect(() => result.ok && result.value).toThrowError("cannot access result directly, use `unwrap()` instead!");
      expect("error" in result).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(result.toString()).toBe(`Ok(None(null))`);
      expect(result.unwrap().toString()).toBe(`None(null)`);
    });
  });

  describe.each([
    { expected: null, condition: "null and the type is not defined" },
    { expected: undefined, condition: "undefined and the type is not defined" },
  ])("when provided $condition", ({ expected }) => {
    it("throws an error if the input is nullish", () => {
      expect(() => Result(expected)).toThrowError(
        "Result cannot contain nullish values, try wrapping your data in an Option first"
      );
    });
  });

  describe.each([
    { result: Result<string, Error>(new Error("test")), expected: new Error("test"), condition: "an error" },
    {
      result: Result<string, Error>(new TestError("test")),
      expected: new TestError("test"),
      condition: "a custom error",
    },
  ])("when provided $condition", ({ result, expected }) => {
    it(`identifies itself as err`, () => {
      expect(result.ok).toBe(false);
    });

    it("unwraps its error", () => {
      expect(result.unwrap()).toBeInstanceOf(Error);
      expect(!result.ok && result.unwrap().message).toBe(expected.message);
      expect(() => result.unwrapErr()).toThrowError(expected.message);
    });

    it("has an error property and throws an error when accessed directly", () => {
      expect("error" in result).toBe(true);
      expect(() => !result.ok && result.error).toThrowError("cannot access result directly, use `unwrap()` instead!");
      expect("value" in result).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(result.toString()).toBe(`Err(${expected})`);
    });
  });
});

describe("Option", () => {
  describe.each([
    { option: Option<string>("test"), expected: "test", defaultVal: "default", condition: "a value" },
    { option: Option<string>(""), expected: "", defaultVal: "default", condition: "an empty string" },
  ])("when provided $condition", ({ option, expected, defaultVal }) => {
    it(`identifies itself as some`, () => {
      expect(option.some).toBe(true);
    });

    it("coalesces its value", () => {
      expect(option.coalesce()).toBe(expected);
      expect(option.coalesce(defaultVal)).toBe(expected);
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in option).toBe(true);
      expect(() => option.some && option.value).toThrowError(
        "cannot access option directly, use `coalesce()` instead!"
      );
      expect("error" in option).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(option.toString()).toBe(`Some(${expected})`);
    });
  });

  describe.each([
    { option: Option<number>(0), expected: 0, defaultVal: 1, condition: "a 0" },
    { option: Option<number>(NaN), expected: NaN, defaultVal: 1, condition: "a NaN" },
  ])("when provided $condition", ({ option, expected, defaultVal }) => {
    it(`identifies itself as some`, () => {
      expect(option.some).toBe(true);
    });

    it("coalesces its value", () => {
      expect(option.coalesce()).toBe(expected);
      expect(option.coalesce(defaultVal)).toBe(expected);
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in option).toBe(true);
      expect(() => option.some && option.value).toThrowError(
        "cannot access option directly, use `coalesce()` instead!"
      );
      expect("error" in option).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(option.toString()).toBe(`Some(${expected})`);
    });
  });

  describe("when provided a false", () => {
    const option = Option<boolean>(false);

    it(`identifies itself as some`, () => {
      expect(option.some).toBe(true);
    });

    it("coalesces its value", () => {
      expect(option.coalesce()).toBe(false);
      expect(option.coalesce(true)).toBe(false);
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in option).toBe(true);
      expect(() => option.some && option.value).toThrowError(
        "cannot access option directly, use `coalesce()` instead!"
      );
      expect("error" in option).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(option.toString()).toBe(`Some(${false})`);
    });
  });

  describe("when provided an empty array", () => {
    const option = Option<string[]>([]);

    it(`identifies itself as some`, () => {
      expect(option.some).toBe(true);
    });

    it("coalesces its value", () => {
      expect(option.coalesce()).toEqual([]);
      expect(option.coalesce(["default"])).toEqual([]);
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in option).toBe(true);
      expect(() => option.some && option.value).toThrowError(
        "cannot access option directly, use `coalesce()` instead!"
      );
      expect("error" in option).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(option.toString()).toBe(`Some(${[]})`);
    });
  });

  describe.each([
    {
      option: Option<string>(null),
      defaultVal: "default",
      condition: "null and the type is explicitly defined",
    },
    {
      option: Option<string>(undefined),
      defaultVal: "default",
      condition: "undefined and the type is explicitly defined",
    },
  ])("when provided $condition", ({ option, defaultVal }) => {
    it(`identifies itself as none`, () => {
      expect(option.some).toBe(false);
    });

    it("coalesces its value", () => {
      expect(option.coalesce()).toBe(null);
      expect(option.coalesce(defaultVal)).toBe(defaultVal);
    });

    it("has a value property and throws an error when accessed directly", () => {
      expect("value" in option).toBe(true);
      expect(() => !option.some && option.value).toThrowError(
        "cannot access option directly, use `coalesce()` instead!"
      );
      expect("error" in option).toBe(false);
    });

    it("prints itself as a string", () => {
      expect(option.toString()).toBe("None(null)");
    });
  });
});
