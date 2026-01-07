import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VercelLogo } from "@/components/ui/icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <VercelLogo className="w-4 h-4 text-foreground" />
              <span className="font-medium text-sm text-foreground">
                Feedback Links
              </span>
            </div>
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Collect customer feedback
          </h1>
          <p className="text-muted mb-8">
            Create a personal feedback link to add to your email signature.
            Customers can share anonymous feedback about their experience working with you.
          </p>
          <Link href="/login">
            <Button className="gap-2">
              <VercelLogo className="w-4 h-4" />
              Sign in with Vercel
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <p className="text-xs text-muted text-center">
          Internal tool for Vercelians
        </p>
      </footer>
    </div>
  );
}
