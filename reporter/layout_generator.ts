import type { Block, KnownBlock } from "@slack/types"
import type { SummaryResults } from "playwright-slack-report/dist/src"
import * as tags from "../test/helpers/constants/tags"

function getProductFromTag(tagName: string): string {
  switch (tagName) {
    case tags.AURORA_PLUS_TAG:
      return "Aurora+"
    case tags.AURORA_PLUS_TAG_BORROWING:
      return "Aurora+ Borrowing"
    case tags.AURORA_PLUS_TAG_DEPOSITING:
      return "Aurora+ Depositing"
    case tags.AURORA_PLUS_TAG_STAKING:
      return "Aurora+ Staking"
    case tags.AURORA_PLUS_TAG_SWAPPING:
      return "Aurora+ Swapping"
    case tags.WEB3_WALLET_TAG:
      return "Near3"
    case tags.WEB3_WALLET_TAG_STAKING:
      return "Near3 Staking"
    case tags.WEB3_WALLET_TAG_SWAPPING:
      return "Near3 Swapping"
    case tags.WEB3_WALLET_TAG_TRANSFERING:
      return "Near3 Transferring"
    default:
      return "All products - Near3 & Aurora+"
  }
}

const generateFailures = (
  summaryResults: SummaryResults,
  maxNumberOfFailures: number,
): Array<KnownBlock | Block> => {
  const maxNumberOfFailureLength = 650
  const fails = []

  const numberOfFailuresToShow = Math.min(
    summaryResults.failures.length,
    maxNumberOfFailures,
  )

  for (let i = 0; i < numberOfFailuresToShow; i += 1) {
    const { failureReason, test, suite } = summaryResults.failures[i]
    const formattedFailure = failureReason
      .substring(0, maxNumberOfFailureLength)
      .split("\n")
      .map((l: string) => `>${l}`)
      .join("\n")
    fails.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${suite} > ${test}*
        \n${formattedFailure}`,
      },
    })
  }

  if (
    maxNumberOfFailures > 0 &&
    summaryResults.failures.length > maxNumberOfFailures
  ) {
    fails.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*⚠️ There are too many failures to display - ${fails.length} out of ${summaryResults.failures.length} failures shown*`,
      },
    })
  }

  if (fails.length === 0) {
    return []
  }

  return [
    {
      type: "divider",
    },
    ...fails,
  ]
}

export default function generateCustomLayoutSimpleMeta(
  summaryResults: SummaryResults,
): Array<Block | KnownBlock> {
  let header = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `🎭 Playwright Results`,
    },
  }

  if (summaryResults.meta) {
    const foundValue = summaryResults.meta.find(
      (pair) => pair.key === "Product",
    )

    const product = getProductFromTag(foundValue!.value)

    header = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🎭 Playwright Results - *${product}*`,
      },
    }
  }

  const summary = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `✅ *${summaryResults.passed}* | ❌ *${summaryResults.failed}* |${
        summaryResults.flaky !== undefined
          ? ` 🟡 *${summaryResults.flaky}* | `
          : " "
      }⏩ *${summaryResults.skipped}*`,
    },
  }

  const fails = generateFailures(summaryResults, 10)

  return [header, summary, ...fails]
}
