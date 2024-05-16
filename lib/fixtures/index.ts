import { mergeTests } from "playwright/test"
import { metamaskTest } from "./metamask"
import { extensionsTest } from "./extensions"
import { appsTest } from "./apps"

export const test = mergeTests(metamaskTest, extensionsTest, appsTest)

export const { expect } = test
