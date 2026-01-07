import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { feedback, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";

// GET - Fetch feedback for the current user
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feedbackList = await db
    .select()
    .from(feedback)
    .where(eq(feedback.recipientId, user.id))
    .orderBy(desc(feedback.createdAt));

  return NextResponse.json({ feedback: feedbackList });
}

// POST - Submit new feedback
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

  // Create feedback
  const [newFeedback] = await db
    .insert(feedback)
    .values({
      recipientId: recipient[0].id,
      sentiment,
      comment,
      isAnonymous: isAnonymous ?? true,
      submitterName: isAnonymous ? null : submitterName,
      submitterEmail: isAnonymous ? null : submitterEmail,
      submitterVercelId: isAnonymous ? null : submitterVercelId,
    })
    .returning();

  return NextResponse.json({ feedback: newFeedback }, { status: 201 });
}
