"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Link as LinkIcon, ThumbsUp, ThumbsDown, Meh } from "@/components/ui/icons";

// Mock current user
const currentUser = {
  name: "Alex Rivera",
  role: "Customer Success Manager",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  username: "alex-rivera",
};

// Mock feedback data
const mockFeedback = [
  {
    id: "1",
    sentiment: "positive" as const,
    comment: "Alex was incredibly helpful during our migration to Vercel. They took the time to understand our specific needs and provided tailored solutions. Highly recommend working with them!",
    isAnonymous: false,
    submitterName: "Marcus Thompson",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "2",
    sentiment: "positive" as const,
    comment: "Quick response time and very knowledgeable. Helped us resolve a complex caching issue in under an hour.",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "3",
    sentiment: "neutral" as const,
    comment: "Good support overall. The initial response took a bit longer than expected, but once connected, the help was solid.",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "4",
    sentiment: "positive" as const,
    comment: "Alex went above and beyond to help us understand the best practices for our Next.js deployment. Very patient and thorough in explanations.",
    isAnonymous: false,
    submitterName: "Emily Watson",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: "5",
    sentiment: "negative" as const,
    comment: "Had some miscommunication about the project timeline. Would appreciate more proactive updates in the future.",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: "6",
    sentiment: "positive" as const,
    comment: "Fantastic experience! Alex helped us optimize our build times by 40%. Couldn't be happier with the results.",
    isAnonymous: false,
    submitterName: "David Kim",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const feedbackUrl = `feedback.vercel.com/${currentUser.username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${feedbackUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate stats
  const stats = {
    total: mockFeedback.length,
    positive: mockFeedback.filter((f) => f.sentiment === "positive").length,
    neutral: mockFeedback.filter((f) => f.sentiment === "neutral").length,
    negative: mockFeedback.filter((f) => f.sentiment === "negative").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} />

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
                    <span className="text-sm font-mono text-foreground">
                      {feedbackUrl}
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

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "50ms" }}>
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
              {mockFeedback.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          </div>
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
      <p className={`text-3xl font-bold ${color ? colorClasses[color] : "text-foreground"}`}>
        {value}
      </p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </Card>
  );
}

function FeedbackCard({
  feedback,
}: {
  feedback: (typeof mockFeedback)[0];
}) {
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
