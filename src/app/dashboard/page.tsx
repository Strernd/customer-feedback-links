"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  Link as LinkIcon,
} from "@/components/ui/icons";

// Types
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string | null;
  avatarUrl: string | null;
  slackUserId: string | null;
  managerEmail: string | null;
  managerSlackUserId: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slackUserId, setSlackUserId] = useState("");
  const [slackIdSaved, setSlackIdSaved] = useState(false);
  const [slackIdError, setSlackIdError] = useState("");
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  // Manager state
  const [managerEmail, setManagerEmail] = useState("");
  const [managerSlackUserId, setManagerSlackUserId] = useState("");
  const [managerSaved, setManagerSaved] = useState(false);
  const [managerError, setManagerError] = useState("");
  const [isDetectingManager, setIsDetectingManager] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData.user);
        setSlackUserId(userData.user?.slackUserId || "");
        setManagerEmail(userData.user?.managerEmail || "");
        setManagerSlackUserId(userData.user?.managerSlackUserId || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAutoDetect = async () => {
    setSlackIdError("");
    setSlackIdSaved(false);
    setIsAutoDetecting(true);

    try {
      const res = await fetch("/api/slack/detect", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.slackUserId) {
        setSlackUserId(data.slackUserId);
        setUser(data.user);
        setSlackIdSaved(true);
        setTimeout(() => setSlackIdSaved(false), 3000);
      } else {
        setSlackIdError(
          data.error || "Could not auto-detect. Please enter your Slack user ID manually below."
        );
      }
    } catch (error) {
      setSlackIdError("Failed to auto-detect. Please try manual entry.");
    } finally {
      setIsAutoDetecting(false);
    }
  };

  const handleSaveSlackId = async () => {
    setSlackIdError("");
    setSlackIdSaved(false);

    if (!slackUserId.trim()) {
      setSlackIdError("Please enter a Slack user ID");
      return;
    }

    if (!slackUserId.match(/^U[A-Z0-9]{8,10}$/)) {
      setSlackIdError(
        "Invalid format. Slack user IDs start with 'U' followed by 8-10 characters"
      );
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slackUserId }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSlackIdSaved(true);
        setTimeout(() => setSlackIdSaved(false), 3000);
      } else {
        setSlackIdError("Failed to save Slack user ID");
      }
    } catch (error) {
      setSlackIdError("Failed to save Slack user ID");
    }
  };

  const handleAutoDetectManager = async () => {
    setManagerError("");
    setManagerSaved(false);
    setIsDetectingManager(true);

    if (!managerEmail.trim()) {
      setManagerError("Please enter your manager's email address");
      setIsDetectingManager(false);
      return;
    }

    try {
      const res = await fetch("/api/manager/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerEmail: managerEmail.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.managerSlackUserId) {
        setManagerSlackUserId(data.managerSlackUserId);
        setUser(data.user);
        setManagerSaved(true);
        setTimeout(() => setManagerSaved(false), 3000);
      } else {
        setManagerError(
          data.error || "Could not auto-detect. Please enter Slack user ID manually below."
        );
      }
    } catch (error) {
      setManagerError("Failed to auto-detect. Please try manual entry.");
    } finally {
      setIsDetectingManager(false);
    }
  };

  const handleSaveManager = async () => {
    setManagerError("");
    setManagerSaved(false);

    if (!managerEmail.trim()) {
      setManagerError("Please enter your manager's email address");
      return;
    }

    if (!managerSlackUserId.trim()) {
      setManagerError("Please enter your manager's Slack user ID");
      return;
    }

    if (!managerSlackUserId.match(/^U[A-Z0-9]{8,10}$/)) {
      setManagerError(
        "Invalid format. Slack user IDs start with 'U' followed by 8-10 characters"
      );
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail: managerEmail.trim(),
          managerSlackUserId: managerSlackUserId.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setManagerSaved(true);
        setTimeout(() => setManagerSaved(false), 3000);
      } else {
        setManagerError("Failed to save manager configuration");
      }
    } catch (error) {
      setManagerError("Failed to save manager configuration");
    }
  };

  const handleRemoveManager = async () => {
    setManagerError("");
    setManagerSaved(false);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail: null,
          managerSlackUserId: null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setManagerEmail("");
        setManagerSlackUserId("");
        setManagerSaved(true);
        setTimeout(() => setManagerSaved(false), 3000);
      } else {
        setManagerError("Failed to remove manager");
      }
    } catch (error) {
      setManagerError("Failed to remove manager");
    }
  };

  const feedbackUrl = user
    ? `${window.location.origin}/feedback/${user.username}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={
          user
            ? {
                name: user.name,
                role: user.role || undefined,
                avatarUrl: user.avatarUrl || undefined,
              }
            : undefined
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Slack Configuration - REQUIRED FIRST */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "50ms" }}>
            <h2 className="text-lg font-semibold text-foreground">
              Slack configuration
            </h2>
            <Card>
              <div className="space-y-4">
                {user?.slackUserId ? (
                  // Slack is connected
                  <div>
                    <div className="flex items-center gap-2 p-3 bg-success-bg border border-success/30 rounded-lg mb-3">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-success">Slack connected</p>
                        <p className="text-xs text-success/80 mt-0.5">
                          User ID: <span className="font-mono">{user.slackUserId}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted">
                      Feedback will be delivered to your Slack DMs. You can update your configuration below if needed.
                    </p>
                  </div>
                ) : (
                  // Slack not connected yet
                  <div>
                    <div className="p-3 bg-warning-bg border border-warning/30 rounded-lg mb-3">
                      <p className="text-sm font-medium text-warning">Setup required</p>
                      <p className="text-xs text-warning/80 mt-1">
                        Connect your Slack account to receive feedback via DM
                      </p>
                    </div>
                    <Button
                      onClick={handleAutoDetect}
                      className="w-full sm:w-auto gap-2"
                      isLoading={isAutoDetecting}
                    >
                      {isAutoDetecting ? "Detecting..." : "Auto-detect Slack Account"}
                    </Button>
                    <p className="text-xs text-muted mt-2">
                      We'll look up your Slack account using{" "}
                      <span className="font-mono bg-card-hover px-1 py-0.5 rounded">
                        {user?.email}
                      </span>
                    </p>
                  </div>
                )}

                {/* Manual configuration - always available */}
                <details className="group">
                  <summary className="text-sm text-muted cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-2">
                    <span className="text-xs">▸</span>
                    <span className="group-open:hidden">
                      {user?.slackUserId ? "Update" : "Or manually enter"} Slack user ID
                    </span>
                    <span className="hidden group-open:inline">
                      Manually configure Slack ID
                    </span>
                  </summary>

                  <div className="mt-4 space-y-3 pl-5">
                    <p className="text-xs text-muted">
                      {user?.slackUserId
                        ? "Update your Slack user ID if needed:"
                        : "If your Slack email doesn't match your Vercel email, manually enter your Slack user ID:"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Input
                          label="Slack user ID"
                          placeholder="U01ABCD1234"
                          value={slackUserId}
                          onChange={(e) => setSlackUserId(e.target.value.toUpperCase())}
                        />
                        <p className="text-xs text-muted mt-1.5">
                          Find it in Slack: Profile → More → Copy member ID
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={handleSaveSlackId}
                        className="sm:self-start sm:mt-6 gap-1.5"
                      >
                        {slackIdSaved ? (
                          <>
                            <Check className="w-4 h-4 text-success" />
                            Saved
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  </div>
                </details>

                {slackIdError && (
                  <div className="p-3 bg-error-bg border border-error/20 rounded-lg">
                    <p className="text-sm text-error">{slackIdError}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Manager Configuration - Optional */}
          {user?.slackUserId && (
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h2 className="text-lg font-semibold text-foreground">
                Manager feedback (optional)
              </h2>
              <Card>
                <div className="space-y-4">
                  {user?.managerSlackUserId ? (
                    // Manager configured
                    <div>
                      <div className="flex items-center gap-2 p-3 bg-success-bg border border-success/30 rounded-lg mb-3">
                        <Check className="w-4 h-4 text-success shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-success">Manager configured</p>
                          <p className="text-xs text-success/80 mt-0.5">
                            {user.managerEmail} • <span className="font-mono">{user.managerSlackUserId}</span>
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveManager}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-muted">
                        Your manager will receive a copy of all feedback sent to you
                      </p>
                    </div>
                  ) : (
                    // Manager not configured yet
                    <div>
                      <p className="text-sm text-foreground mb-3">
                        Optionally add your manager to receive copies of all feedback. They'll see who the feedback is for.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <Input
                            label="Manager's email"
                            type="email"
                            placeholder="manager@company.com"
                            value={managerEmail}
                            onChange={(e) => setManagerEmail(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={handleAutoDetectManager}
                          variant="secondary"
                          className="w-full sm:w-auto"
                          isLoading={isDetectingManager}
                        >
                          Auto-detect Manager's Slack
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Manual configuration */}
                  {!user?.managerSlackUserId && (
                    <details className="group">
                      <summary className="text-sm text-muted cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-2">
                        <span className="text-xs">▸</span>
                        <span className="group-open:hidden">Or manually enter manager's Slack user ID</span>
                        <span className="hidden group-open:inline">Manually configure manager</span>
                      </summary>

                      <div className="mt-4 space-y-3 pl-5">
                        <p className="text-xs text-muted">
                          If auto-detect failed, you can manually enter your manager's Slack user ID:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <Input
                              label="Manager's Slack user ID"
                              placeholder="U01ABCD1234"
                              value={managerSlackUserId}
                              onChange={(e) => setManagerSlackUserId(e.target.value.toUpperCase())}
                            />
                            <p className="text-xs text-muted mt-1.5">
                              Ask them to find it: Slack Profile → More → Copy member ID
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            onClick={handleSaveManager}
                            className="sm:self-start sm:mt-6 gap-1.5"
                          >
                            {managerSaved ? (
                              <>
                                <Check className="w-4 h-4 text-success" />
                                Saved
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </div>
                    </details>
                  )}

                  {managerError && (
                    <div className="p-3 bg-error-bg border border-error/20 rounded-lg">
                      <p className="text-sm text-error">{managerError}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Only show feedback link and instructions AFTER Slack is configured */}
          {user?.slackUserId ? (
            <>
              {/* Feedback Link Card */}
              <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
                <Card variant="highlight">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="mb-1">Your feedback link</CardTitle>
                      <CardDescription>
                        Share this link in your email signature to collect feedback
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border">
                        <LinkIcon className="w-4 h-4 text-muted" />
                        <span className="text-sm font-mono text-foreground truncate max-w-[200px]">
                          /feedback/{user?.username}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-success" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Email Signature Suggestions */}
              <SignatureSuggestions feedbackUrl={feedbackUrl} />

              {/* Info Card */}
              <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h2 className="text-lg font-semibold text-foreground">
                  How it works
                </h2>
                <Card>
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      When someone submits feedback through your link, you'll receive it directly as a Slack DM.
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-success-bg border border-success/30 flex items-center justify-center text-xs font-medium text-success shrink-0">
                        1
                      </div>
                      <p className="text-sm text-muted flex-1">
                        Add the feedback link to your email signature
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-success-bg border border-success/30 flex items-center justify-center text-xs font-medium text-success shrink-0">
                        2
                      </div>
                      <p className="text-sm text-muted flex-1">
                        Customers click the link and share their feedback
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-success-bg border border-success/30 flex items-center justify-center text-xs font-medium text-success shrink-0">
                        3
                      </div>
                      <p className="text-sm text-muted flex-1">
                        You receive the feedback instantly via Slack DM
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border">
                      <p className="text-xs text-muted">
                        Note: Feedback is sent directly to Slack and is not stored in any database for GDPR compliance
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function SignatureSuggestions({ feedbackUrl }: { feedbackUrl: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates = [
    {
      id: "driving",
      label: "Playful",
      text: `<a href="${feedbackUrl}">How's my driving? Give anonymous feedback.</a>`,
      preview: "How's my driving? Give anonymous feedback.",
    },
    {
      id: "direct",
      label: "Direct",
      text: `<a href="${feedbackUrl}">Have feedback? Let me know</a>`,
      preview: "Have feedback? Let me know",
    },
    {
      id: "friendly",
      label: "Friendly",
      text: `<a href="${feedbackUrl}">I'd love to hear your feedback!</a>`,
      preview: "I'd love to hear your feedback!",
    },
    {
      id: "professional",
      label: "Professional",
      text: `<a href="${feedbackUrl}">Your feedback helps me improve</a>`,
      preview: "Your feedback helps me improve",
    },
  ];

  const handleCopy = async (id: string, html: string) => {
    // Copy as HTML for rich text paste (Gmail)
    const blob = new Blob([html], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob, "text/plain": new Blob([html], { type: "text/plain" }) })];
    await navigator.clipboard.write(data);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: "50ms" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Add to your email signature
          </h2>
          <p className="text-sm text-muted mt-1">
            Copy one of these snippets to start collecting feedback
          </p>
        </div>
        <a
          href="https://mail.google.com/mail/u/0/#settings/general"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted hover:text-foreground transition-colors shrink-0"
        >
          Open Gmail settings →
        </a>
      </div>
      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-card hover:bg-card-hover transition-colors"
          >
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <span className="text-xs font-medium text-muted uppercase tracking-wide shrink-0 w-28">
                {template.label}
              </span>
              <p className="text-sm text-accent underline truncate">
                {template.preview}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(template.id, template.text)}
              className="shrink-0 gap-1.5"
            >
              {copiedId === template.id ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
