import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getSession } from "@/lib/auth/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { role, slackUserId, managerEmail, managerSlackUserId } = body;

  // Build the update object dynamically
  const updates: {
    role?: string;
    slackUserId?: string | null;
    managerEmail?: string | null;
    managerSlackUserId?: string | null;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (role !== undefined) {
    if (typeof role !== "string") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    updates.role = role;
  }

  if (slackUserId !== undefined) {
    if (slackUserId !== null && typeof slackUserId !== "string") {
      return NextResponse.json(
        { error: "Invalid slackUserId" },
        { status: 400 }
      );
    }
    updates.slackUserId = slackUserId;
  }

  if (managerEmail !== undefined) {
    if (managerEmail !== null && typeof managerEmail !== "string") {
      return NextResponse.json(
        { error: "Invalid managerEmail" },
        { status: 400 }
      );
    }
    updates.managerEmail = managerEmail;
  }

  if (managerSlackUserId !== undefined) {
    if (managerSlackUserId !== null && typeof managerSlackUserId !== "string") {
      return NextResponse.json(
        { error: "Invalid managerSlackUserId" },
        { status: 400 }
      );
    }
    updates.managerSlackUserId = managerSlackUserId;
  }

  await db
    .update(users)
    .set(updates)
    .where(eq(users.id, session.user.id));

  const updatedUser = await getCurrentUser();

  return NextResponse.json({ user: updatedUser });
}
