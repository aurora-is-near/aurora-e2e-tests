import type { Block, KnownBlock } from "@slack/types"
import { SummaryResults } from "."

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

const generateFallbackText = (summaryResults: SummaryResults): string =>
  `✅ ${summaryResults.passed} ❌ ${summaryResults.failed} ${
    summaryResults.flaky !== undefined ? ` 🟡 ${summaryResults.flaky} ` : " "
  }⏩ ${summaryResults.skipped}`

const generateBlocks = (
  summaryResults: SummaryResults,
  maxNumberOfFailures: number,
): Array<KnownBlock | Block> => {
  const meta = []
  const header = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "🎭 *Playwright Results*",
    },
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

  const fails = generateFailures(summaryResults, maxNumberOfFailures)

  if (summaryResults.meta) {
    for (const metaRecord of summaryResults.meta) {
      const { key, value } = metaRecord
      meta.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `\n*${key}* :\t${value}`,
        },
      })
    }
  }

  return [header, summary, ...meta, ...fails]
}

export { generateBlocks, generateFailures, generateFallbackText }
