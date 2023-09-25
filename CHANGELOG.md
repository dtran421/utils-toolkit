# utils-toolkit

## 0.2.1

### Patch Changes

- 9a026d1: Added support for null values when creating `ApiResponse`s

## 0.2.0

### Minor Changes

- 0de51ca: Big documentation updates, revamped some utilities:

  - Return types now support discriminant unions (type inference!)
  - README now has documentation on how to use functions and types
  - There are example files to demonstrate usage in an IDE environment
  - Updated unit tests to be more comprehensive (including falsy tests and null/undefined)
  - .gitignore now ignores .DS_Store (thanks Apple)

## 0.1.1

### Patch Changes

- abbdd83:
  - Added `changesets` for change logs
  - Added bundling via `tsup`
  - New `lint`, `typecheck`, `vup`, and `build` scripts
  - Added `api` module for API utils
  - Added `cn()` function for working with Tailwind class names
