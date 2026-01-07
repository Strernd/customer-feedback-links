"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import {
  VercelLogo,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Send,
  Check,
} from "@/components/ui/icons";

type Sentiment = "positive" | "neutral" | "negative" | null;

// Mock user data
const mockUser = {
  name: "Sarah Chen",
  username: "sarah-chen",
  role: "Solutions Engineer",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
};

export default function FeedbackPage() {
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentiment || !comment.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return <SuccessState userName={mockUser.name} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-accent/3 via-transparent to-transparent" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
        >
          <VercelLogo className="w-4 h-4" />
          <span className="text-sm font-medium">Feedback Links</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-start justify-center p-6 pt-8">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Card */}
            <Card className="animate-fade-in">
              <div className="flex items-center gap-4">
                <Avatar
                  src={mockUser.avatarUrl}
                  alt={mockUser.name}
                  size="xl"
                />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {mockUser.name}
                  </h1>
                  <p className="text-sm text-muted">{mockUser.role}</p>
                  <p className="text-xs text-muted mt-1">at Vercel</p>
                </div>
              </div>
            </Card>

            {/* Feedback Form */}
            <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Share your feedback
              </h2>
              <p className="text-sm text-muted mb-6">
                How was your experience working with {mockUser.name.split(" ")[0]}?
              </p>

              {/* Sentiment Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  How would you rate your experience?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <SentimentButton
                    type="positive"
                    selected={sentiment === "positive"}
                    onClick={() => setSentiment("positive")}
                    icon={<ThumbsUp className="w-5 h-5" />}
                    label="Positive"
                  />
                  <SentimentButton
                    type="neutral"
                    selected={sentiment === "neutral"}
                    onClick={() => setSentiment("neutral")}
                    icon={<Meh className="w-5 h-5" />}
                    label="Neutral"
                  />
                  <SentimentButton
                    type="negative"
                    selected={sentiment === "negative"}
                    onClick={() => setSentiment("negative")}
                    icon={<ThumbsDown className="w-5 h-5" />}
                    label="Negative"
                  />
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <Textarea
                  label="Your feedback"
                  placeholder="Share specific details about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[140px]"
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="p-4 bg-card-hover rounded-lg border border-border mb-6">
                <Toggle
                  checked={isAnonymous}
                  onChange={setIsAnonymous}
                  label="Submit anonymously"
                  description="Your identity will not be shared with the recipient"
                />
              </div>

              {/* Identity Fields (when not anonymous) */}
              {!isAnonymous && (
                <div className="space-y-4 mb-6 animate-fade-in">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-xs text-muted">or identify yourself</span>
                    <div className="flex-1 border-t border-border" />
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full gap-2"
                  >
                    <VercelLogo className="w-4 h-4" />
                    Sign in with Vercel
                  </Button>

                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-xs text-muted">or enter manually</span>
                    <div className="flex-1 border-t border-border" />
                  </div>

                  <Input
                    label="Your name"
                    placeholder="John Doe"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                  />
                  <Input
                    label="Your email"
                    type="email"
                    placeholder="john@company.com"
                    value={submitterEmail}
                    onChange={(e) => setSubmitterEmail(e.target.value)}
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={!sentiment || !comment.trim()}
                isLoading={isSubmitting}
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </Button>
            </Card>

            {/* Privacy Notice */}
            <p className="text-xs text-muted text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              Your feedback is valuable and helps improve customer experience.
              {isAnonymous && " This feedback will be submitted anonymously."}
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

function SentimentButton({
  type,
  selected,
  onClick,
  icon,
  label,
}: {
  type: "positive" | "neutral" | "negative";
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const styles = {
    positive: {
      selected: "bg-success-bg border-success/40 text-success",
      default: "bg-card border-border text-muted hover:border-success/30 hover:text-success",
    },
    neutral: {
      selected: "bg-warning-bg border-warning/40 text-warning",
      default: "bg-card border-border text-muted hover:border-warning/30 hover:text-warning",
    },
    negative: {
      selected: "bg-error-bg border-error/40 text-error",
      default: "bg-card border-border text-muted hover:border-error/30 hover:text-error",
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2 py-4 px-3
        rounded-xl border-2 transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${selected ? styles[type].selected : styles[type].default}
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function SuccessState({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center animate-fade-in max-w-md">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-bg border border-success/30 mb-6">
          <Check className="w-8 h-8 text-success" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Thank you!
        </h1>
        <p className="text-muted mb-8">
          Your feedback has been sent to {userName}. They&apos;ll really appreciate
          you taking the time to share your thoughts.
        </p>

        <Link href="/">
          <Button variant="secondary" className="gap-2">
            <VercelLogo className="w-4 h-4" />
            Learn more about Feedback Links
          </Button>
        </Link>
      </div>
    </div>
  );
}
