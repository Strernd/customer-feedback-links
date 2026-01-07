import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VercelLogo, ArrowRight } from "@/components/ui/icons";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <LoginContent searchParams={searchParams} />;
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  const errorMessages: Record<string, string> = {
    oauth_error: "OAuth authentication failed. Please try again.",
    invalid_state: "Invalid authentication state. Please try again.",
    token_exchange: "Failed to complete authentication. Please try again.",
    user_info: "Could not retrieve your profile. Please try again.",
    unauthorized: "This tool is only available for Vercel employees.",
    server_error: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
        >
          <VercelLogo className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <Card className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-foreground">
                <VercelLogo className="w-8 h-8 text-background" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-muted mb-6">
              Sign in with your Vercel account to manage your feedback links
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-error-bg border border-error/20 text-sm text-error">
                {errorMessages[error] || "An error occurred. Please try again."}
              </div>
            )}

            {/* Sign in button */}
            <a href="/api/auth/login">
              <Button size="lg" className="w-full gap-2.5">
                <VercelLogo className="w-4 h-4" />
                Sign in with Vercel
              </Button>
            </a>

            {/* Logout / switch account */}
            <a href="/api/auth/logout" className="block mt-3">
              <Button variant="ghost" size="sm" className="w-full text-muted">
                Sign out / Switch account
              </Button>
            </a>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted">note</span>
              </div>
            </div>

            {/* Info text */}
            <p className="text-xs text-muted leading-relaxed">
              This tool is exclusively for Vercel employees.
              <br />
              You&apos;ll need a{" "}
              <span className="text-foreground">@vercel.com</span> email to sign
              in.
            </p>
          </Card>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <Link
              href="/feedback/sarah-chen"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              See what a feedback page looks like
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted">
          By signing in, you agree to our internal policies
        </p>
      </footer>
    </div>
  );
}
