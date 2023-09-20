import { Result } from "./return-types";

/**
 * ApiResponse: A response from an API containing data if successful or an error message if not.
 *
 * This should be used to neatly package API responses for consumption by the client.
 */
export type ApiResponse<T> =
  | {
      data: T;
    }
  | {
      error: string;
    };

/* ApiResponse constructor */
export const ApiResponse = <T = unknown>(o: T | Error | string): ApiResponse<T> => {
  if (o instanceof Error) {
    return { error: o.message };
  }

  if (typeof o === "string") {
    return { error: o };
  }

  return { data: o };
};

/**
 * Consume an API response and return a Result.
 *
 * This is intended to be used client-side, where the API response being consumed
 * is a simple object with a `data` or `error` property. The `error` property
 * should be a string for ease of displaying.
 */
export const consumeApiResponse = <T = unknown>(response: ApiResponse<T>) => {
  if ("error" in response) {
    return Result<T, Error>(new Error(response.error));
  }

  return Result<T, Error>(response.data);
};
