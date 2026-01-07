"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Copy, Check, LogOut, Mail } from "@/components/ui/icons";

// Mock current user
const currentUser = {
  name: "Alex Rivera",
  role: "Customer Success Manager",
  email: "alex@vercel.com",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  username: "alex-rivera",
};

const feedbackUrl = `https://feedback.vercel.com/${currentUser.username}`;

// Email signature templates
const signatureTemplates = [
  {
    id: "direct",
    label: "Direct",
    text: `Have feedback? Let me know: ${feedbackUrl}`,
    preview: "Have feedback? Let me know: [link]",
  },
  {
    id: "friendly",
    label: "Friendly",
    text: `I'd love to hear your thoughts! ${feedbackUrl}`,
    preview: "I'd love to hear your thoughts! [link]",
  },
  {
    id: "professional",
    label: "Professional",
    text: `Your feedback helps me improve: ${feedbackUrl}`,
    preview: "Your feedback helps me improve: [link]",
  },
  {
    id: "anonymous",
    label: "Anonymous focus",
    text: `Share your thoughts anonymously: ${feedbackUrl}`,
    preview: "Share your thoughts anonymously: [link]",
  },
];

export default function SettingsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="animate-fade-in">
            <Card>
              <CardHeader className="mb-0">
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  This information is displayed on your feedback page
                </CardDescription>
              </CardHeader>
              <div className="flex items-center gap-4 mt-6 p-4 bg-card-hover rounded-xl border border-border">
                <Avatar
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  size="xl"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {currentUser.name}
                  </h3>
                  <p className="text-sm text-muted">{currentUser.role}</p>
                  <p className="text-xs text-muted mt-1">{currentUser.email}</p>
                </div>
                <Link href={`/feedback/${currentUser.username}`} target="_blank">
                  <Button variant="secondary" size="sm">
                    Preview page
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Email Signature Section */}
          <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
            <Card>
              <CardHeader className="mb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-card-hover border border-border">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <CardTitle>Email Signature</CardTitle>
                    <CardDescription>
                      Add one of these to your email signature
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <div className="space-y-3 mt-6">
                {signatureTemplates.map((template) => (
                  <SignatureOption
                    key={template.id}
                    template={template}
                    isCopied={copiedId === template.id}
                    onCopy={() => handleCopy(template.id, template.text)}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-accent/5 rounded-xl border border-accent/20">
                <p className="text-sm text-muted">
                  <strong className="text-foreground">Pro tip:</strong> Add your
                  feedback link to your email signature in your email client
                  settings. Most customers appreciate the option to share
                  feedback directly.
                </p>
              </div>
            </Card>
          </div>

          {/* Account Section */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Card>
              <CardHeader className="mb-0">
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Sign out
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      Sign out of your Vercel account
                    </p>
                  </div>
                  <Link href="/">
                    <Button variant="danger" size="sm" className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SignatureOption({
  template,
  isCopied,
  onCopy,
}: {
  template: (typeof signatureTemplates)[0];
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="group relative p-4 bg-card-hover rounded-xl border border-border hover:border-[#444] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              {template.label}
            </span>
          </div>
          <p className="text-sm text-foreground font-mono break-all">
            {template.preview.replace("[link]", "")}
            <span className="text-accent">
              {feedbackUrl.replace("https://", "")}
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="shrink-0 gap-1.5"
        >
          {isCopied ? (
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
    </div>
  );
}
