import type { Block, KnownBlock } from "@slack/types"
import type { SummaryResults } from "playwright-slack-report/dist/src"

export default function generateCustomLayout(
  summaryResults: SummaryResults,
): Array<Block | KnownBlock> {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          summaryResults.failed === 0
            ? ":tada: All tests passed!"
            : `😭${summaryResults.failed} failure(s) out of ${summaryResults.tests.length} tests`,
      },
    },
  ]
}
