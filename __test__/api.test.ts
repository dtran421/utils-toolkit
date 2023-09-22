import { describe, expect, test } from "@jest/globals";

import { ApiResponse, consumeApiResponse } from "../src/api";
import { TestError } from "./stubs";

describe("ApiResponse", () => {
  test("it returns an error if the input is an error", () => {
    const error = new Error("test");
    const errorResult = ApiResponse<string>(error);

    expect(errorResult).toEqual({ success: false, error });
    expect(!errorResult.success && errorResult.error.message).toEqual(error.message);
  });

  test("it returns an error if the input is a custom error", () => {
    const error = new TestError("test");
    const errorResult = ApiResponse(error);

    expect(errorResult).toEqual({ success: false, error });
  });

  test("it returns the data if the input is not an error", () => {
    const dataResult = ApiResponse("test");

    expect(dataResult).toEqual({ success: true, data: "test" });
  });

  test("it returns the null data if the input is null", () => {
    const dataResult = ApiResponse(null);

    expect(dataResult).toEqual({ success: true, data: null });
  });

  test("it returns the undefined data if the input is undefined", () => {
    const dataResult = ApiResponse(undefined);

    expect(dataResult).toEqual({ success: true, data: undefined });
  });
});

describe("consumeApiResponse", () => {
  test("it returns an error if the response has an error", () => {
    const errorResponse = ApiResponse(new Error("test"));
    const result = consumeApiResponse(errorResponse);

    expect(result.unwrap()).toEqual(new Error("test"));

    const errorResponseWithTestError = ApiResponse(new TestError("test"));
    const resultWithTestError = consumeApiResponse(errorResponseWithTestError);

    expect(resultWithTestError.unwrap()).not.toEqual(new Error("test"));
    expect(resultWithTestError.unwrap()).toEqual(new TestError("test"));
  });

  test("it returns the data if the response has no error", () => {
    const dataResponse = ApiResponse("test");
    const result = consumeApiResponse(dataResponse);

    expect(result.unwrapErr()).toEqual("test");

    const dataResponseWithNull = ApiResponse(null);
    const resultWithNull = consumeApiResponse(dataResponseWithNull);

    expect(resultWithNull.unwrapErr()).toEqual(null);

    const dataResponseWithUndefined = ApiResponse(undefined);
    const resultWithUndefined = consumeApiResponse(dataResponseWithUndefined);

    expect(resultWithUndefined.unwrapErr()).toEqual(undefined);
  });
});
