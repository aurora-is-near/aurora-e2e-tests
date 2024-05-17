import { mergeTests } from "playwright/test"
import { metamaskTest } from "./metamask"
import { extensionsTest } from "./extensions"
import { auroraPlusTest } from "./aurora-plus"

export const test = mergeTests(metamaskTest, extensionsTest, auroraPlusTest)

export const { expect } = test
