/* eslint-disable no-console */

/* ================ isNullish ================ */

import { isNullish } from "../src/general";

console.log(isNullish("Some value here")); // false
console.log(isNullish(123)); // false
console.log(isNullish(true)); // false
console.log(isNullish([])); // false
console.log(isNullish({})); // false

console.log(isNullish(null)); // true
console.log(isNullish(undefined)); // true

console.log(isNullish("")); // false
console.log(isNullish(0)); // false
console.log(isNullish(false)); // false
