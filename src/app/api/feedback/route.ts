import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendFeedbackToSlack, sendFeedbackToManager } from "@/lib/slack";

// POST - Submit new feedback (ONLY to Slack, no DB storage)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    recipientUsername,
    sentiment,
    comment,
    isAnonymous,
    submitterName,
    submitterEmail,
    submitterVercelId,
  } = body;

  // Validate required fields
  if (!recipientUsername || !sentiment || !comment) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!["positive", "neutral", "negative"].includes(sentiment)) {
    return NextResponse.json({ error: "Invalid sentiment" }, { status: 400 });
  }

  // Find recipient
  const recipient = await db
    .select()
    .from(users)
    .where(eq(users.username, recipientUsername))
    .limit(1);

  if (recipient.length === 0) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  // Check if recipient has Slack configured
  const slackUserId = recipient[0].slackUserId;

  if (!slackUserId) {
    console.error(
      `No Slack configured for ${recipient[0].username} - feedback cannot be delivered`
    );
    return NextResponse.json(
      { error: "Recipient has not configured Slack delivery" },
      { status: 503 }
    );
  }

  // Send feedback to Slack (ONLY delivery method - no DB storage)
  try {
    const feedbackData = {
      recipientUsername: recipient[0].username,
      recipientName: recipient[0].name,
      sentiment,
      comment,
      isAnonymous: isAnonymous ?? true,
      submitterName: isAnonymous ? null : submitterName,
      submitterEmail: isAnonymous ? null : submitterEmail,
    };

    // Send to recipient (primary - this must succeed)
    await sendFeedbackToSlack(slackUserId, feedbackData);

    // Also send to manager if configured (secondary - allowed to fail)
    if (recipient[0].managerSlackUserId) {
      await sendFeedbackToManager(recipient[0].managerSlackUserId, feedbackData);
    }

    return NextResponse.json(
      { message: "Feedback sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to send feedback to Slack:", error);
    return NextResponse.json(
      { error: "Failed to deliver feedback. Please try again later." },
      { status: 500 }
    );
  }
}
