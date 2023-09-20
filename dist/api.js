"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeApiResponse = exports.ApiResponse = void 0;
const return_types_1 = require("./return-types");
/* ApiResponse constructor */
const ApiResponse = (o) => {
    if (o instanceof Error) {
        return { error: o.message };
    }
    if (typeof o === "string") {
        return { error: o };
    }
    return { data: o };
};
exports.ApiResponse = ApiResponse;
/**
 * Consume an API response and return a Result.
 *
 * This is intended to be used client-side, where the API response being consumed
 * is a simple object with a `data` or `error` property. The `error` property
 * should be a string for ease of displaying.
 */
const consumeApiResponse = (response) => {
    if ("error" in response) {
        return (0, return_types_1.Result)(new Error(response.error));
    }
    return (0, return_types_1.Result)(response.data);
};
exports.consumeApiResponse = consumeApiResponse;
