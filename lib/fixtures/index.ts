import { mergeTests } from "playwright/test"
import { metamaskTest } from "./metamask"
import { extensionsTest } from "./extensions"

export const test = mergeTests(metamaskTest, extensionsTest)

export const { expect } = test
