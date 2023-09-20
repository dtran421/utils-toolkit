import { describe, expect, test } from "@jest/globals";

import { ApiResponse, consumeApiResponse } from "../src/api";

describe("ApiResponse", () => {
  test("it returns an error if the input is an error", () => {
    const errorResult = ApiResponse(new Error("test"));

    expect(errorResult).toEqual({ error: "test" });
  });

  test("it returns an error if the input is a string", () => {
    const errorResult = ApiResponse("test");

    expect(errorResult).toEqual({ error: "test" });
  });

  test("it returns the data if the input is not an error", () => {
    const dataResult = ApiResponse("test");

    expect(dataResult).toEqual({ error: "test" });
  });
});

describe("consumeApiResponse", () => {
  test("it returns an error if the response has an error", () => {
    const errorResponse = {
      error: "test",
    };

    const result = consumeApiResponse(errorResponse);

    expect(result.unwrap()).toEqual(new Error("test"));
  });

  test("it returns the data if the response has no error", () => {
    const dataResponse = {
      data: "test",
    };

    const result = consumeApiResponse(dataResponse);

    expect(result.ok()).toEqual("test");
  });
});
