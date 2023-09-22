import { describe, expect, test } from "@jest/globals";

import { Option, Result } from "../src/return-types";
import { TestError } from "./stubs";

describe("Result", () => {
  test("it identifies itself as ok or err", () => {
    const okResult = Result<string, Error>("test");
    expect(okResult.ok).toBe(true);

    const okResultWithNull = Result<null, Error>(null);
    expect(okResultWithNull.ok).toBe(true);

    const okResultWithUndefined = Result<undefined, Error>(undefined);
    expect(okResultWithUndefined.ok).toBe(true);

    const errResult = Result<string, Error>(new Error("test"));
    expect(errResult.ok).toBe(false);

    const errResultWithTestError = Result<string, TestError>(new TestError("test"));
    expect(errResultWithTestError.ok).toBe(false);
  });

  test("it unwraps its value/error", () => {
    const okResult = Result<string, Error>("test");

    expect(okResult.unwrap()).toBe("test");
    expect(okResult.unwrapErr()).toBe("test");

    const okResultWithNull = Result<null, Error>(null);

    expect(okResultWithNull.unwrap()).toBe(null);
    expect(okResultWithNull.unwrapErr()).toBe(null);

    const okResultWithUndefined = Result<undefined, Error>(undefined);

    expect(okResultWithUndefined.unwrap()).toBe(undefined);
    expect(okResultWithUndefined.unwrapErr()).toBe(undefined);

    const errResult = Result<string, Error>(new Error("test"));

    expect(errResult.unwrap()).toBeInstanceOf(Error);
    expect((errResult.unwrap() as Error).message).toBe("test");
    expect(() => errResult.unwrapErr()).toThrowError("test");

    const errResultWithTestError = Result<string, TestError>(new TestError("test"));

    expect(errResultWithTestError.unwrap()).toBeInstanceOf(TestError);
    expect((errResultWithTestError.unwrap() as TestError).message).toBe("Test: test");
    expect(() => errResultWithTestError.unwrapErr()).toThrowError("Test: test");
  });

  test("it has a value/error property and throws an error when accessed directly", () => {
    const okResult = Result<string, Error>("test");

    expect("value" in okResult).toBe(true);
    expect(() => okResult.ok && okResult.value).toThrowError("cannot access result directly, use `unwrap()` instead!");
    expect("error" in okResult).toBe(false);

    const okResultWithNull = Result<null, Error>(null);

    expect("value" in okResultWithNull).toBe(true);
    expect(() => okResultWithNull.ok && okResultWithNull.value).toThrowError(
      "cannot access result directly, use `unwrap()` instead!"
    );
    expect("error" in okResultWithNull).toBe(false);

    const okResultWithUndefined = Result<undefined, Error>(undefined);

    expect("value" in okResultWithUndefined).toBe(true);
    expect(() => okResultWithUndefined.ok && okResultWithUndefined.value).toThrowError(
      "cannot access result directly, use `unwrap()` instead!"
    );

    const errResult = Result<string, Error>(new Error("test"));

    expect("error" in errResult).toBe(true);
    expect(() => !errResult.ok && errResult.error).toThrowError(
      "cannot access result directly, use `unwrap()` instead!"
    );
    expect("value" in errResult).toBe(false);

    const errResultWithTestError = Result<string, TestError>(new TestError("test"));

    expect("error" in errResultWithTestError).toBe(true);
    expect(() => !errResultWithTestError.ok && errResultWithTestError.error).toThrowError(
      "cannot access result directly, use `unwrap()` instead!"
    );
    expect("value" in errResultWithTestError).toBe(false);
  });
});

describe("Option", () => {
  test("it identifies itself as some or none", () => {
    const someOption = Option<string>("test");
    expect(someOption.some).toBe(true);

    const noneOption = Option<string>(null);
    expect(noneOption.some).toBe(false);
  });

  test("it coalesces its value", () => {
    const someOption = Option<string>("test");

    expect(someOption.coalesce()).toBe("test");
    expect(someOption.coalesce("default")).toBe("test");

    const noneOption = Option<string>(null);

    expect(noneOption.coalesce()).toBe(null);
    expect(noneOption.coalesce("default")).toBe("default");

    const undefinedNoneOption = Option<string>(undefined);

    expect(undefinedNoneOption.coalesce()).toBe(null);
    expect(undefinedNoneOption.coalesce("default")).toBe("default");
  });

  test("it has a value property and throws an error when accessed directly", () => {
    const someOption = Option<string>("test");

    expect("value" in someOption).toBe(true);
    expect(() => someOption.value).toThrowError("cannot access option directly, use `coalesce()` instead!");
    expect("error" in someOption).toBe(false);

    const noneOption = Option<string>(null);

    expect("value" in noneOption).toBe(true);
    expect(() => noneOption.value).toThrowError("cannot access option directly, use `coalesce()` instead!");
    expect("error" in noneOption).toBe(false);
  });
});
