# Aurora End-to-end tests

A set of end-to-end tests for Aurora applications, written with
[Playwright](https://playwright.dev/).

## Installation

Install dependencies:

```text
yarn install
```

## Usage

The tests are located in the `tests/` directory and can be run as follows:

```text
yarn test
```

Or, to run in headless mode:

```text
yarn test:headless
```

## Wallet configuration

The MetaMask extension is used for testing wallet functionality. The version we
currently use is defined against the `METAMASK_VERSION` variable at
[lib/constants/metamask.ts](./lib/constants/metamask.ts).

By default, a test wallet will be created using the seed phrase:

```text
test test test test test test test test test test test junk
```

However, some tests will require a wallet that contains assets. You can set the
seed phrase for the wallet you want to use for testing via the
`WALLET_SEED_PHRASE` environment variable.

If you want to set a MetaMask password you can do so via the `WALLET_PASSWORD`
environment variable. If you choose not to a random password will be generated.

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

## Base URLs

By default, the tests run against the production URLs for each application. For
example, Aurora Plus tests are run against <https://aurora.plus>. If you want to
run the tests against some other base URL (e.g. for local development) you can
set the relevant environment variable before running the tests, like so:

```text
AURORA_PLUS_BASE_URL=http://localhost:3000 yarn test
```

## Environment variables

A sample `.env` file can be generated as follows:

```text
cp .env.sample .env
```
