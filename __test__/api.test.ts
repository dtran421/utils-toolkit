import { describe, expect, it } from "@jest/globals";

import { ApiResponse, consumeApiResponse } from "../src/api";
import { TestError } from "./stubs";

describe("ApiResponse", () => {
  describe.each([
    { data: "test", condition: "a value" },
    { data: null, condition: "null and the type is explicitly defined" },
    { data: null, condition: "null and the type is not defined" },
  ])("when provided $condition", ({ data }) => {
    it("returns the data if the input is not an error", () => {
      const dataResult = ApiResponse(data).unwrapErr();

      expect(dataResult).toEqual({ success: true, data });
    });
  });

  describe.each([
    { error: new Error("test"), condition: "an error" },
    { error: new TestError("test"), condition: "a custom error" },
  ])("when provided $condition", ({ error }) => {
    it("returns an error if the input is an error", () => {
      const errorResult = ApiResponse(error).unwrapErr();
      const apiResponse = errorResult;

      expect(apiResponse).toEqual({ success: false, error });
      expect(!apiResponse.success && apiResponse.error.message).toEqual(error.message);
    });
  });

  describe("when provided undefined", () => {
    it("throws an error if the input is undefined and the type is explicitly defined", () => {
      // @ts-expect-error: intentionally testing undefined
      expect(() => ApiResponse<string>(undefined).unwrapErr()).toThrowError(
        "ApiResponse cannot contain undefined data"
      );
    });

    it("throws an error if the input is undefined and the type is not defined", () => {
      expect(() => ApiResponse(undefined).unwrapErr()).toThrowError("ApiResponse cannot contain undefined data");
    });
  });
});

describe("consumeApiResponse", () => {
  describe.each([
    { data: "test", condition: "a value" },
    { data: null, condition: "null and the type is explicitly defined" },
    { data: null, condition: "null and the type is not defined" },
  ])(`when provided $condition`, ({ data }) => {
    it("returns the data if the response has no error", () => {
      const dataResponse = ApiResponse(data).unwrapErr();
      const result = consumeApiResponse(dataResponse);

      expect(result.ok && result.unwrap().coalesce()).toEqual(data);
    });
  });

  describe.each([
    { error: new Error("test"), condition: "an error" },
    { error: new TestError("test"), condition: "a custom error" },
  ])("when provided $condition", ({ error }) => {
    it("returns an error if the response has an error", () => {
      const errorResponse = ApiResponse(error).unwrapErr();
      const result = consumeApiResponse(errorResponse);

      expect(result.unwrap()).toEqual(error);
      expect(() => result.unwrapErr()).toThrowError(error.message);
    });
  });
});
