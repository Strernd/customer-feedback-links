import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("submitter_state")?.value;
  const codeVerifier = cookieStore.get("submitter_code_verifier")?.value;
  const returnTo = cookieStore.get("submitter_return_to")?.value || "/";

  // Clean up OAuth cookies
  cookieStore.delete("submitter_state");
  cookieStore.delete("submitter_code_verifier");
  cookieStore.delete("submitter_return_to");

  if (error || !code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(new URL(returnTo, request.url));
  }

  try {
    // Exchange code for tokens
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
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/submitter/callback`,
          code_verifier: codeVerifier,
        }),
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // Fetch user info
    const userInfoResponse = await fetch(
      "https://api.vercel.com/login/oauth/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }

    const userInfo = await userInfoResponse.json();

    // Store submitter info in cookie (for use in feedback form)
    const submitterInfo = {
      vercelId: userInfo.sub,
      name: userInfo.name || "",
      email: userInfo.email || "",
      picture: userInfo.picture || "",
    };

    const response = NextResponse.redirect(new URL(returnTo, request.url));
    response.cookies.set("submitter_info", JSON.stringify(submitterInfo), {
      httpOnly: false, // Allow JS access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30, // 30 minutes
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL(returnTo, request.url));
  }
}
