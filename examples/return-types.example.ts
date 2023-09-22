/* eslint-disable no-console */

/* ======================= Result ======================= */

import { Result } from "../src/return-types";

function foo(ok: boolean): Result<string, Error> {
  if (!ok) {
    return Result<string, Error>(new Error("Something went wrong"));
  }

  return Result<string, Error>("Everything is fine");
}

const okResult: Result<string, Error> = foo(true);

console.log(okResult.ok); // true
console.log(okResult.unwrap()); // 'Everything is fine'
console.log(okResult.unwrapErr()); // 'Everything is fine'

const errResult = foo(false);

console.log(errResult.ok); // false
console.log(errResult.unwrap()); // Error { message: 'Something went wrong' }
console.log(errResult.unwrapErr()); // throws 'Error: Something went wrong'

if (!errResult.ok) {
  //                  ✨ type inference magic -- errResult is now an Err<Error> variant
  const error: Error = errResult.unwrap();

  console.log(error.message); // 'Something went wrong'
}

// ⚠️ or if you want to be forceful

console.log(okResult.unwrapErr()); // 'Everything is fine'
console.log(errResult.unwrapErr()); // throws 'Error: Something went wrong'

/* ======================= Option ======================= */

import { Option } from "../src/return-types";

function bar(some: boolean): Option<string> {
  if (!some) {
    return Option<string>(null);
  }

  return Option("Everything is fine");
}

const someOption: Option<string> = bar(true);

console.log(someOption.some); // true
console.log(someOption.coalesce()); // 'Everything is fine'
console.log(someOption.coalesce("Default value")); // 'Everything is fine' <-- default value is ignored

const noneOption: Option<string> = bar(false);

console.log(noneOption.some); // false
console.log(noneOption.coalesce()); // null
console.log(noneOption.coalesce("Default value")); // 'Default value'
