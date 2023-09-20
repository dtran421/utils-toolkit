"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = exports.Result = void 0;
const general_1 = require("./general");
/* Result constructor */
const Result = (p) => {
    const ok = !(p instanceof Error);
    const o = { isOk: () => ok, isErr: () => !ok };
    Object.defineProperties(o, {
        [ok ? "value" : "error"]: {
            get() {
                throw new Error("cannot access result directly, use `unwrap()` instead!");
            },
        },
        unwrap: {
            value: () => p,
        },
        ok: {
            value: () => {
                if (ok) {
                    return p;
                }
                throw p;
            },
        },
    });
    return o;
};
exports.Result = Result;
/* Option constructor */
const Option = (value) => {
    const some = !(0, general_1.isNullish)(value);
    const o = {};
    Object.defineProperties(o, {
        value: {
            get() {
                throw new Error("cannot access option directly, use `coalesce()` instead!");
            },
        },
        coalesce: {
            value: (defaultValue) => (some ? value : defaultValue !== null && defaultValue !== void 0 ? defaultValue : null),
        },
        isNone: {
            value: () => !some,
        },
        isSome: {
            value: () => some,
        },
    });
    return o;
};
exports.Option = Option;
