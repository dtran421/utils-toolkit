import { isNullish } from "./general";

/** ********
 * RESULT  *
 ********* */

/* Components */

/**
 * Container for a success value of a successful operation. The value should contain data returned from the operation.
 *
 * Note that the `value` should not be accessed directly, as this would circumvent checking if the result is an `Ok`
 * or `Err` variant first. Attempting to access the `value` directly will throw an error.
 *
 * > Unfortunately, Typescript doesn't support discriminated unions via private properties, so the `ok` property is
 * used to determine if the result is an `Ok` or `Err` variant. However, in an ideal world (perhaps in the future),
 * `isOk()` and `isErr()` would be used instead to be more precise.
 *
 * `unwrap()` will return the value if it is called on an `Ok` variant.
 *
 * `unwrapErr()` will return the value if it is called on an `Ok` variant.
 */
export type Ok<T> = { ok: true; value: T; unwrap: () => T; unwrapErr: () => T };
/**
 * Container for an error value of a failed operation. The error should contain information about the failure.
 * This variant is generically typed with E to indicate it can contain different types of error values.
 *
 * Note that the `error` should not be accessed directly, as this would circumvent checking if the result is an `Ok`
 * or `Err` variant first. Attempting to access the `error` directly will throw an error.
 *
 * > Unfortunately, Typescript doesn't support discriminated unions via private properties, so the `ok` property is
 * used to determine if the result is an `Ok` or `Err` variant. However, in an ideal world (perhaps in the future),
 * `isOk()` and `isErr()` would be used instead to be more precise.
 *
 * `unwrap()` will return the error if it is called on an `Err` variant.
 *
 * `unwrapErr()` will throw the error if it is called on an `Err` variant.
 */
export type Err<E> = {
  ok: false;
  error: E;
  unwrap: () => E;
  unwrapErr: () => never;
};
/**
 * The result of an operation that can fail. It will contain a value (which can be null) if the operation was successful,
 * or an error if the operation failed.
 *
 * This type is generically typed with T and E to indicate it can contain different types of success and error values.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/* Result constructor */
export const Result = <T = unknown, E = Error>(p: T | E): Result<T, E> => {
  if (isNullish(p)) {
    throw new Error("Result cannot contain nullish values, try wrapping your data in an Option first");
  }

  const ok = !(p instanceof Error);
  const o = { ok, toString: () => (ok ? `Ok(${p})` : `Err(${p})`) };

  Object.defineProperties(o, {
    [ok ? "value" : "error"]: {
      get() {
        throw new Error("cannot access result directly, use `unwrap()` instead!");
      },
    },
    unwrap: {
      value: () => p,
    },
    unwrapErr: {
      value: () => {
        if (ok) {
          return p;
        }

        throw p;
      },
    },
  });

  return o as Result<T, E>;
};

/** ********
 * OPTION  *
 * ******* */

/* Components */

/**
 * Container for a non-nullish (not necessarily truthy) result of an operation. The value should contain data returned from the operation.
 *
 * Note that the value cannot be accessed directly. This is to prevent the value from being accessed without checking
 * if the option is a `Some` or `None` variant first. Attempting to access the value directly will throw an error.
 *
 * > Unfortunately, Typescript doesn't support discriminated unions via private properties, so the `some` property is
 * used to determine if the option is a `Some` or `None` variant. However, in an ideal world (perhaps in the future),
 * `isSome()` and `isNone()` would be used instead to be more precise.
 *
 * `coalesce()` will return the value if it is called on a Some variant, regardless of whether a default value is provided.
 */
export type Some<T> = {
  some: true;
  value: T;
  coalesce: (defaultValue?: T) => T;
};
/**
 * Container for a nullish result of an operation. The value should contain a nullish value (null or undefined).
 *
 * Note that the value cannot be accessed directly. This is to prevent the value from being accessed without checking
 * if the option is a `Some` or `None` variant first. Attempting to access the value directly will throw an error.
 *
 * > Unfortunately, Typescript doesn't support discriminated unions via private properties, so the `some` property is
 * used to determine if the option is a `Some` or `None` variant. However, in an ideal world (perhaps in the future),
 * `isSome()` and `isNone()` would be used instead to be more precise.
 *
 * `coalesce()` will return the default value if it is called on a None variant, or null if no default value is provided.
 */
export type None<T> = {
  some: false;
  value: null | undefined;
  coalesce: (defaultValue?: T) => T;
};

/**
 * The result of an operation that may return an optional value. It can contain a non-nullish (not necessarily truthy) value
 * or a nullish value (null or undefined).
 *
 * This type is generically typed with T to indicate it can contain different types of values.
 */
export type Option<T> = Some<T> | None<T>;

/* Option constructor */
export const Option = <T = unknown>(value?: T | null): Option<T> => {
  const some = !isNullish(value);
  const o = { some, toString: () => (some ? `Some(${value})` : "None(null)") };

  Object.defineProperties(o, {
    value: {
      get() {
        throw new Error("cannot access option directly, use `coalesce()` instead!");
      },
    },
    coalesce: {
      value: (defaultValue?: T) => (some ? value : defaultValue ?? null),
    },
  });

  return o as Option<T>;
};
