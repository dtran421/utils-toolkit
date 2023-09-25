import { Result } from "./return-types";

/**
 * Container for data returned from a successful API call.
 *
 * This is intended to be created server-side,
 * where the `data` property holds the result of the successful operation.
 */
export interface Success<T> {
  success: true;
  data: T | null;
}

/**
 * Container for an error returned from a failed API call.
 *
 * This is intended to be created server-side, where the operations being performed
 * may throw errors. The `error` property should hold the error thrown by the operation.
 */
export interface Failure {
  success: false;
  error: Error;
}

/**
 * ApiResponse: A response from an API containing data if successful or an error message if not.
 *
 * This should be used to neatly package API responses for consumption by the client.
 */
export type ApiResponse<T> = Success<T> | Failure;

/* Components */

/* ApiResponse constructor */
export const ApiResponse = <T = unknown>(o: T | Error | null): ApiResponse<T> => {
  if (o === undefined) {
    throw new Error("ApiResponse cannot contain undefined data");
  }

  return o instanceof Error
    ? {
        success: false,
        error: o,
      }
    : {
        success: true,
        data: o,
      };
};

/**
 * Consume an API response and return a Result.
 *
 * This is intended to be used client-side, where the API response being consumed
 * is a simple object with a `data` or `error` property. The `error` property
 * should be a string for ease of displaying.
 */
export const consumeApiResponse = <T = unknown>(response: ApiResponse<T>): Result<T, Error> => {
  if (!response.success) {
    return Result<T, Error>(response.error);
  }

  return Result<T, Error>(response.data);
};
