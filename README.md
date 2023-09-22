# Utils Toolkit

For your ease of development, with a heavy emphasis on well-typed, frustration-free DX.

## Installation

### `npm`

```bash
npm i utils-toolkit
```

### `yarn`

```bash
yarn add utils-toolkit
```

## Usage

### Return Types

#### `Result<T, E>`

For the `Result` type, we use the convention of `Ok` and `Err` to represent the two possible outcomes of a function. This is similar to Rust's `Result` type, albeit it's hard to replicate the exact same behavior and usage pattern in Javascript.

As the implementer, you are responsible for returning the correct type. For example, if you have a function that returns a `Result<string, Error>`, you must return either `Ok<string>('some value')` to indicate a success (it doesn't have to be a string, it can be any type) or `Err<Error>(new Error('some error'))` to indicate a failure (again, it doesn't have to be
a generic Error, it can be any custom error you design as long as it implements Javascript's `Error`).

```ts
import { Result } from "utils-toolkit";

function foo(ok: boolean): Result<string, Error> {
  if (!ok) {
    return Result<string, Error>(new Error("Something went wrong"));
  }

  return Result<string, Error>("Everything is fine");
}
```

As the user, you can use the `ok` property to check the type of the result. If you want to get the value of the result, you can use the `unwrap()` method. If you want to be forceful, you can use the `unwrapErr()` method to get the value of the result or throw an error if the result is an `Err`.

```ts
const okResult: Result<string, Error> = foo(true);

console.log(okResult.ok); // true
console.log(okResult.unwrap()); // 'Everything is fine'
```

```ts
const errResult = foo(false);

console.log(errResult.ok); // false
console.log(errResult.unwrap()); // Error { message: 'Something went wrong' }
```

```ts
if (!errResult.ok) {
  //                  ✨ type inference magic -- errResult is now an Err<Error> variant
  const error: Error = errResult.unwrap();

  console.log(error.message); // 'Something went wrong'
}
```

```ts
// ⚠️ or if you want to be forceful

console.log(okResult.unwrapErr()); // 'Everything is fine'
console.log(errResult.unwrapErr()); // throws 'Error: Something went wrong'
```

---

#### `Option<T>`

For the `Option` type, we use the convention of `Some` and `None` to represent the two possible outcomes of a function. This is similar to Rust's `Option` type.

As the implementer, you only need to wrap your return value in the `Option` 'constructor' and the library will take care of the rest. For example, if you have a function that fetches external data and you're not sure if it'll return a non-nullish value, you can wrap it in the `Option` 'constructor' to indicate that the function may return `null` or `undefined`.

```ts
import { Option } from "utils-toolkit";

function bar(some: boolean): Option<string> {
  if (!some) {
    return Option<string>(null);
  }

  return Option("Everything is fine");
}
```

As the user, you can use the `some` property to check the type of the result. If you want to get the value of the result, you can use the `coalesce()` method. Optionally (haha get it?), you can pass in a default value to the `coalesce()` method to return the default value if the result is `None`.

```ts
const someResult: Option<string> = foo(true);

console.log(someResult.some); // true
console.log(someResult.coalesce()); // 'Everything is fine'
console.log(someResult.coalesce("Default value")); // 'Everything is fine' <-- default value is ignored
```

```ts
const noneOption: Option<string> = bar(false);

console.log(noneOption.some); // false
console.log(noneOption.coalesce()); // null
console.log(noneOption.coalesce("Default value")); // 'Default value'
```

### Functions - Server

#### `ApiResponse<T>`

The `ApiResponse` 'constructor' is a helper function that returns a standardized response body for your API. It takes in a generic type `T` and returns an object with a `success` boolean value and a `data` property of type `T` if the response is successful, or an `error` property of type `Error` if the response is errored.

```ts
import { ApiResponse } from "utils-toolkit";

const routeHandler = async (req: Request, res: Response) => {
  const apiRes = await fetch("https://some-api.com");

  if (!apiRes.ok) {
    return res.json(ApiResponse<Data>(new Error("Something went wrong")));
  }

  const data = await apiRes.json();
  return res.json(ApiResponse<Data>(data));
};
```

```json
// Successful response body
{
  "success": true,
  "data": {
    "some": "data"
  }
}
```

```json
// Errored response body
{
  "success": false,
  "error": {
    "message": "Something went wrong"
  }
}
```

### Functions - Client

#### `consumeApiResponse<T>`

The `consumeApiResponse` function is a helper function that takes in an `ApiResponse` object and returns a `Result<T, Error>` object. If the `ApiResponse` object is successful, it returns an `Ok<T>` variant with the `data` property of the `ApiResponse` object. If the `ApiResponse` object is errored, it returns an `Err<Error>` variant with the `error` property of the `ApiResponse` object.

```tsx
import { consumeApiResponse } from "utils-toolkit";
// ... other imports

const Component = () => {
  const [data, setData] = useState<Data>(null);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://my-api.com");
      const resData = await res.json();

      const data = consumeApiResponse<Data>(resData);

      if (!data.ok) {
        // const error = data.unwrapErr(); <-- if you want to be forceful and risk crashing your page

        const error = data.unwrap();
        return setError(error.message);
      }

      const myData = data.unwrap();
      // do something with myData
      setData(myData);
    };

    fetchData();
  }, []);

  return (
    <>
      {data && <div>{data}</div>}
      {error && <div>{error}</div>}
    </>
  );
};
```

#### `cn`

First popularized by the rapidly growing `shadcn/ui` library, the `cn` function is a helper function that takes in any number of args of type `ClassValues` and and returns a single string of class names. This is useful for conditionally applying CSS classes to your React components.

Note that it is only meant for TailwindCSS classes, so it will not work with other CSS-in-JS libraries like `styled-components` or `emotion`. Also, it makes use of the `clsx` and `tailwind-merge` libraries, which I obviously did not write. If they are updated and break this function, I will do my best to maintain it, but just know that it is not guaranteed to work with future versions of those libraries.

> I also have no idea how to write unit tests for this function, so if you have any ideas or suggestions, please let me know! Otherwise, this function will remain untested, so use at your own risk.

```tsx
import { cn } from "utils-toolkit";

const Component = ({ someProps, darkMode }) => {
  return (
    <div
      className={cn("text-black", {
        "text-white": darkMode,
      })}
    >
      Hello world!
    </div>
  );
};
```

The above snippet will produce the following if `darkMode` is `false` (assumed default here):

```html
<div class="text-black">Hello world!</div>
```

And the following if `darkMode` is `true`:

```html
<div class="text-white">Hello world!</div>
```

### Functions - Miscellaneous

#### `isNullish`

```ts
import { isNullish } from "utils-toolkit";

console.log(isNullish("Some value here")); // false
console.log(isNullish(123)); // false
console.log(isNullish(true)); // false
console.log(isNullish([])); // false
console.log(isNullish({})); // false
```

```ts
console.log(isNullish(null)); // true
console.log(isNullish(undefined)); // true
```

```ts
console.log(isNullish("")); // false
console.log(isNullish(0)); // false
console.log(isNullish(false)); // false
```

### More to come
