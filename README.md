# Aurora End-to-end tests

A set of end-to-end tests for Aurora applications, written with
[Playwright](https://playwright.dev/).

The MetaMask extension is used for testing wallet functionality. The version we
currently use is defined against the `METAMASK_VERSION` variable at
[lib/constants/metamask.ts](./lib/constants/metamask.ts).

## Usage

Install dependencies:

```text
yarn install
```

The tests are located in the `tests/` directory and can be run as follows:

```text
yarn test
```

Or, to run in headless mode:

```text
yarn test:headless
```

## Tags

Tests are [tagged](https://playwright.dev/docs/test-annotations#tag-tests) so
we can run only the tests we are interested in for a particular scenario. For
example, when we release Aurora Plus we may want to run only the Aurora Plus
tests. We can do so with:

```text
yarn test --grep @aurora-plus
```

See [lib/constants/tags.ts](./lib/constants/tags.ts) for a list of the available
tags.
