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
  const { role } = body;

  if (typeof role !== "string") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  const updatedUser = await getCurrentUser();

  return NextResponse.json({ user: updatedUser });
}
