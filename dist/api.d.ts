import { Result } from "./return-types";
/**
 * ApiResponse: A response from an API containing data if successful or an error message if not.
 *
 * This should be used to neatly package API responses for consumption by the client.
 */
export type ApiResponse<T> = {
    data: T;
} | {
    error: string;
};
export declare const ApiResponse: <T = unknown>(o: string | Error | T) => ApiResponse<T>;
/**
 * Consume an API response and return a Result.
 *
 * This is intended to be used client-side, where the API response being consumed
 * is a simple object with a `data` or `error` property. The `error` property
 * should be a string for ease of displaying.
 */
export declare const consumeApiResponse: <T = unknown>(response: ApiResponse<T>) => Result<T, Error>;
//# sourceMappingURL=api.d.ts.map