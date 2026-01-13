import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { lookupUserByEmail } from "@/lib/slack";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { managerEmail } = body;

  if (!managerEmail || typeof managerEmail !== "string") {
    return NextResponse.json(
      { error: "Manager email is required" },
      { status: 400 }
    );
  }

  // Try to look up manager's Slack user ID by email
  const managerSlackUserId = await lookupUserByEmail(managerEmail);

  if (!managerSlackUserId) {
    return NextResponse.json(
      {
        error: `Could not find Slack account for ${managerEmail}. You can manually enter their Slack user ID instead.`,
      },
      { status: 404 }
    );
  }

  // Save the manager email and detected Slack user ID
  await db
    .update(users)
    .set({ managerEmail, managerSlackUserId, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  // Fetch updated user
  const [updatedUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return NextResponse.json({
    managerSlackUserId,
    user: updatedUser,
  });
}
