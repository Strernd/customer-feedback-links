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
import { Badge } from "@/components/ui/badge";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";
import {
  Copy,
  Check,
  Link as LinkIcon,
  ThumbsUp,
  ThumbsDown,
  Meh,
} from "@/components/ui/icons";

// Types
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string | null;
  avatarUrl: string | null;
}

interface FeedbackItem {
  id: string;
  sentiment: "positive" | "neutral" | "negative";
  comment: string;
  isAnonymous: boolean;
  submitterName: string | null;
  submitterEmail: string | null;
  submitterVercelId: string | null;
  createdAt: string;
}


function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/user").then((res) => res.json()),
      fetch("/api/feedback").then((res) => res.json()),
    ])
      .then(([userData, feedbackData]) => {
        setUser(userData.user);
        setFeedback(feedbackData.feedback || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const feedbackUrl = user
    ? `${window.location.origin}/feedback/${user.username}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate stats
  const stats = {
    total: feedback.length,
    positive: feedback.filter((f) => f.sentiment === "positive").length,
    neutral: feedback.filter((f) => f.sentiment === "neutral").length,
    negative: feedback.filter((f) => f.sentiment === "negative").length,
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
          {/* Welcome & Link Card */}
          <div className="animate-fade-in">
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

          {feedback.length === 0 ? (
            <>
              {/* Email Signature Suggestions */}
              <SignatureSuggestions feedbackUrl={feedbackUrl} />

              {/* Empty Feedback Preview */}
              <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h2 className="text-lg font-semibold text-foreground">
                  Your feedback
                </h2>
                <div className="border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted">No feedback yet</p>
                  <p className="text-sm text-muted mt-1">
                    Feedback from customers will appear here
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Stats */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in"
                style={{ animationDelay: "50ms" }}
              >
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Positive" value={stats.positive} color="success" />
                <StatCard label="Neutral" value={stats.neutral} color="warning" />
                <StatCard label="Negative" value={stats.negative} color="error" />
              </div>

              {/* Feedback List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Feedback
                </h2>
                <div className="space-y-3 stagger-children">
                  {feedback.map((item) => (
                    <FeedbackCard key={item.id} feedback={item} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: "success" | "warning" | "error";
}) {
  const colorClasses = {
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <Card className="text-center py-4">
      <p
        className={`text-3xl font-bold ${color ? colorClasses[color] : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </Card>
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

function FeedbackCard({ feedback }: { feedback: FeedbackItem }) {
  const sentimentConfig = {
    positive: {
      icon: <ThumbsUp className="w-4 h-4" />,
      variant: "positive" as const,
      label: "Positive",
    },
    neutral: {
      icon: <Meh className="w-4 h-4" />,
      variant: "neutral" as const,
      label: "Neutral",
    },
    negative: {
      icon: <ThumbsDown className="w-4 h-4" />,
      variant: "negative" as const,
      label: "Negative",
    },
  };

  const config = sentimentConfig[feedback.sentiment];

  return (
    <Card className="hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <Badge variant={config.variant} className="gap-1">
          {config.icon}
          {config.label}
        </Badge>
        <span className="text-xs text-muted">
          {formatRelativeTime(feedback.createdAt)}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-3">
        {feedback.comment}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted">
        {feedback.isAnonymous ? (
          <span className="italic">Anonymous</span>
        ) : (
          <span>From {feedback.submitterName}</span>
        )}
      </div>
    </Card>
  );
}
