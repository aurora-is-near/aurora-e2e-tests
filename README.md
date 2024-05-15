# Aurora End-to-end tests

A set of end-to-end tests for Aurora applications, written with
[Playwright](https://playwright.dev/).

## Usage

The tests are located in the `tests/` directory and can be run as follows:

```text
yarn playwright test
```

Or, to run in [UI mode](https://playwright.dev/docs/test-ui-mode):

```text
yarn playwright test --ui
```

## Tags

Tests are [tagged](https://playwright.dev/docs/test-annotations#tag-tests) so
we can run only the tests we are interested in for a particular scenario. For
example, when we release Aurora Plus we may want to run only the Aurora Plus
tests. We can do so with:

```text
yarn playwright test --grep @aurora-plus
```

See [lib/constants/tags.ts](./lib/constants/tags.ts) for a list of the available
tags.
