import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { lookupUserByEmail } from "@/lib/slack";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try to look up Slack user ID by email
  const slackUserId = await lookupUserByEmail(user.email);

  if (!slackUserId) {
    return NextResponse.json(
      {
        error: `Could not find Slack account for ${user.email}. Your Slack email might be different.`,
      },
      { status: 404 }
    );
  }

  // Save the detected Slack user ID
  await db
    .update(users)
    .set({ slackUserId, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  // Fetch updated user
  const [updatedUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return NextResponse.json({
    slackUserId,
    user: updatedUser,
  });
}
