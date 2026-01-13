import { WebClient } from "@slack/web-api";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

interface FeedbackData {
  recipientUsername: string;
  recipientName: string;
  sentiment: "positive" | "neutral" | "negative";
  comment: string;
  isAnonymous: boolean;
  submitterName?: string | null;
  submitterEmail?: string | null;
}

const sentimentEmojis = {
  positive: ":thumbsup:",
  neutral: ":neutral_face:",
  negative: ":thumbsdown:",
};

const sentimentColors = {
  positive: "#36a64f",
  neutral: "#ffcc00",
  negative: "#ff0000",
};

export async function sendFeedbackToSlack(
  slackUserId: string,
  feedback: FeedbackData
): Promise<void> {
  const { sentiment, comment, isAnonymous, submitterName, submitterEmail } =
    feedback;

  const fromText = isAnonymous
    ? "_Anonymous_"
    : submitterName
      ? `*${submitterName}*${submitterEmail ? ` (${submitterEmail})` : ""}`
      : "_Someone_";

  const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback/${feedback.recipientUsername}`;

  try {
    await slackClient.chat.postMessage({
      channel: slackUserId,
      text: `New ${sentiment} feedback received!`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${sentimentEmojis[sentiment]} New ${sentiment} feedback`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*From:* ${fromText}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Feedback:*\n${comment}`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Your feedback link: <${feedbackUrl}|${feedbackUrl}>`,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Failed to send Slack message:", error);
    throw new Error("Failed to send feedback to Slack");
  }
}

export async function sendFeedbackToManager(
  managerSlackUserId: string,
  feedback: FeedbackData
): Promise<void> {
  const { sentiment, comment, isAnonymous, submitterName, submitterEmail, recipientName, recipientUsername } =
    feedback;

  const fromText = isAnonymous
    ? "_Anonymous_"
    : submitterName
      ? `*${submitterName}*${submitterEmail ? ` (${submitterEmail})` : ""}`
      : "_Someone_";

  const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback/${recipientUsername}`;

  try {
    await slackClient.chat.postMessage({
      channel: managerSlackUserId,
      text: `New ${sentiment} feedback for ${recipientName}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${sentimentEmojis[sentiment]} Feedback for ${recipientName}`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*From:* ${fromText}\n*To:* ${recipientName}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Feedback:*\n${comment}`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Manager copy • Feedback link: <${feedbackUrl}|${feedbackUrl}>`,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Failed to send manager copy to Slack:", error);
    // Don't throw - manager copy is optional, don't fail the main delivery
  }
}

export async function lookupUserByEmail(email: string): Promise<string | null> {
  try {
    const result = await slackClient.users.lookupByEmail({
      email,
    });

    if (result.ok && result.user?.id) {
      return result.user.id;
    }

    return null;
  } catch (error) {
    console.error("Failed to lookup Slack user:", error);
    return null;
  }
}
