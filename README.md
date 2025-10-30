# Aurora End-to-end tests

This repository contains tests of the following [projects](./test/helpers/constants/pages.ts)

## Project stack details

Project uses Synpress V4, Playwright, TypeScript, Metamask.

MetaMask extension of Chrome is used for testing wallet functionality. [More information](https://metamask.io/)
</br>Synpress is framework made to MetaMask actions. [More information](https://synpress.io/)
</br>Playwright is Javascript/ TypeScript testing framework. [More information](https://playwright.dev/)

> [!IMPORTANT]
> Currently Synpress has a limitation on supported OSes and only support UNIX based operating systems. Please note that if it's required to run tests on Windows machine, user could do this with WSL. [More about WSL](https://learn.microsoft.com/en-us/windows/wsl/about)

## Project preparation

### Installation
> [!WARNING]
> Before running any commands please ensure that you have NodeJS installed on your device! If you do not have it, please visit: [NodeJS](https://nodejs.org/en)


After downloading code from repository, you must install dependencies with command:
```bash
yarn install
```

Once you have depencdencies installed, please install Playwright
```bash
yarn install playwright
```

### Environmental variables


> [!IMPORTANT]
> Sensitive information must be stored locally in .env file, or as variable/ secret in repository options.

A sample .env file can be generated as follows:
```
cp .env.sample .env
```

### Wallet configuration

You must have at least one wallet config and cache.
Currently there are few wallet configs, e.g.:
</br>[Aurora Plus Wallet MainNet Setup](./test/wallet-setup/aurora-plus.setup.ts)
</br>[NEAR Wallet MainNet Setup](./test/wallet-setup/near-web3-prod.setup.ts)

As it's not safe to publish cache information in repository, before running tests you have to cache it on your machine. To do so, use command:
```bash
yarn synpress
```

### Running tests
There are tests for multiple websites.
If required, you can run all the tests, of all websites at the same time with command:
```bash
yarn test
```

If it's required to run only tests for specific website, you can use tags:
```bash
yarn test --grep @tag-name
```
All available tags can be found in: [Tags](./test/helpers/constants/tags.ts)

> [!CAUTION]
> If you are using a new wallet, and automatic tests keeps failing, please try to go through STAKING scenario manually, as it might be required to agree some metamask steps once.

## Tests development

### Folders structure
Project follows `POM - Page Object Model` design pattern.
</br>In short: pages information, helper methods and other logic split into smaller parts for easier maintainability/ readability.

Below is the structure of folders/ files required for tests development. It does not contain information about the files that will be generated automatically, e.g.: synpress cache or reports.

```
📦
├─ .github
│  └─ workflows
│     └─ *.yml          (Config of Github actions pipeline)
└─ test
   ├─ wallet-setup       (Place to save wallet config files)
   │  └─ *setup.ts      (Wallet config)
   ├─ helpers           (Place to save files of shared content, e.g.: constants, methods)
   │  └─ constants
   │    └─ *.ts         (Constants for various shared info, e.g.: timeouts, urls, tags)
   └─ page_*
      ├─ fixtures
      │  └─ *.ts        (Fixtures used for describing preconditions)
      ├─ pages
      │  └─ *.page.ts   (Place to describe page related selectors or methods)
      └─ specs
         └─ *.spec.ts   (Spec files used to place steps of tests)

```

### Wallet folder
If any additional wallet will be required, please follow the steps below:
</br>1. Create a new file in ```/test/wallet-setup``` folder
</br>2. File should follow naming pattern ```*.setup.ts``` - [more details](https://docs.synpress.io/docs/guides/wallet-cache#file-name)
</br>3. Define wallet details. Use existing wallet as example, or official documentation - [more details](https://docs.synpress.io/docs/guides/wallet-cache#define-the-wallet-setup)
</br>4. After defining a new wallet, you can create a new cache, by using command:
```bash
yarn synpress
```

### Fixtures folder
Fixture files should contain logic/ tests steps that works as prerequisites for multiple tests, E.g.: logging in to wallet or the websites.

### Helpers folder
Helpers folder should contain only information which supposed to be reused in multiple places, e.g.: constants with tags or timeouts, might be some API calls which should be used not on a single project

### Pages folder
Place where all the logic should go. Not only page selectors goes here, but the major part of logic.

### Specs folder
Spec files is the actual test files. While developing tests you should awoid of placing any logic here as much as it's possible.

## Reporting
Project uses "HTML" reporter, which is one of the default option for Playwright.
More information about this reporter you can find [here](https://playwright.dev/docs/test-reporters#html-reporter).

Please note that the reports currently works only on local environment!
You can launch reports with the following command:
```bash
yarn report
```

## Pipelines
All the pipeline configurations you can find in .github/workflows.
The pipelines follow triggerer-worker concept where:
- Automatic pipeline trigger is done every 12 hours on Mondays-Fridays [e2e-trigger.yml](./.github/workflows/e2e-trigger.yml)
- Manual trigger pipeline can be triggered manually by yourself and selecting which specific product/part of product you want to test [e2e-worker.yml](./.github/workflows/e2e-worker.yml)

For checking result of pipeline run, you can go to repository -> Actions -> finished E2E job.

### Test reports
You can check the test result in-place by scrolling down to Github Action run result section called `e2e-tests-summary`. It will show overall status of test run - how many passed/failed/skipped and a list of tests corresponding with the test result.

If you want to go into more detailed results, scroll down to Job Artifacts section and download the compressed Playwright report folder - naming based on the tag used.
