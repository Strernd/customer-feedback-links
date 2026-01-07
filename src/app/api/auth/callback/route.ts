import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;

  // Clean up OAuth cookies
  cookieStore.delete("oauth_state");
  cookieStore.delete("oauth_code_verifier");

  // Handle errors
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_error", request.url)
    );
  }

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", request.url)
    );
  }

  try {
    // Exchange code for tokens (Sign in with Vercel endpoint)
    const tokenResponse = await fetch(
      "https://api.vercel.com/login/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.VERCEL_CLIENT_ID!,
          client_secret: process.env.VERCEL_CLIENT_SECRET!,
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
          code_verifier: codeVerifier,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange", request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // Fetch user info (Sign in with Vercel userinfo endpoint)
    const userInfoResponse = await fetch(
      "https://api.vercel.com/login/oauth/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      console.error("Failed to fetch user info:", errorText);
      return NextResponse.redirect(
        new URL("/login?error=user_info", request.url)
      );
    }

    const vercelUser = await userInfoResponse.json();

    // OIDC userinfo returns: sub, email, name, picture
    const vercelId = vercelUser.sub;
    const email = vercelUser.email;
    const name = vercelUser.name || email?.split("@")[0] || "User";
    const avatarUrl = vercelUser.picture || null;
    const username = email?.split("@")[0] || vercelId;

    // Restrict to Vercel employees only
    if (!email?.endsWith("@vercel.com")) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url)
      );
    }

    // Create or update user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.vercelId, vercelId))
      .limit(1);

    let userId: string;

    if (existingUser.length > 0) {
      // Update existing user
      await db
        .update(users)
        .set({
          name,
          email,
          avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.vercelId, vercelId));
      userId = existingUser[0].id;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          vercelId,
          username,
          name,
          email,
          avatarUrl,
        })
        .returning();
      userId = newUser.id;
    }

    // Create session
    await createSession(userId);

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=server_error", request.url)
    );
  }
}
