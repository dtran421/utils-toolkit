/** ********
 * RESULT  *
 ********* */
/**
 * Ok: The operation was successful, and the value inside contains the result of the operation.
 *
 * `unwrap()` will return the value if it is called on an Ok variant.
 *
 * `ok()` will return the value if it is called on an Ok variant.
 */
export type Ok<T> = {
    value: T;
    unwrap: () => T;
    ok: () => T;
    isOk: () => true;
    isErr: () => false;
};
/**
 * Err: The operation failed, and the value inside contains information about the failure.
 * This variant is generically typed with E to indicate it can contain different types of error values.
 *
 * `unwrap()` will return the error if it is called on an Err variant.
 *
 * `ok()` will throw the error if it is called on an Err variant.
 */
export type Err<E> = {
    error: E;
    unwrap: () => E;
    ok: () => never;
    isOk: () => false;
    isErr: () => true;
};
/**
 * Result: The result of an operation that can fail.
 *
 * This type is generically typed with T and E to indicate it can contain different types of success and error values.
 */
export type Result<T, E> = Ok<T> | Err<E>;
export declare const Result: <T = unknown, E = Error>(p: T | E) => Result<T, E>;
/** ********
 * OPTION  *
 * ******* */
/**
 * Some: The option contains a value.
 *
 * `coalesce()` will return the value if it is called on a Some variant, regardless of whether a default value is provided.
 */
export type Some<T> = {
    some: true;
    value: T;
    coalesce: (defaultValue?: T) => T;
    isNone: () => false;
    isSome: () => true;
};
/**
 * None: The option does not contain a value.
 *
 * `coalesce()` will return the default value if it is called on a None variant, or null if no default value is provided.
 */
export type None<T> = {
    some: false;
    value: null | undefined;
    coalesce: (defaultValue?: T) => T;
    isNone: () => true;
    isSome: () => false;
};
/**
 * Option: A value that may or may not exist.
 *
 * This type is generically typed with T to indicate it can contain different types of values.
 */
export type Option<T> = Some<T> | None<T>;
export declare const Option: <T = unknown>(value?: T | null | undefined) => Option<T>;
//# sourceMappingURL=return-types.d.ts.map