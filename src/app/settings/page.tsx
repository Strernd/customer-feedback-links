"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";
import { Copy, Check, LogOut, Mail } from "@/components/ui/icons";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string | null;
  avatarUrl: string | null;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setRole(data.user?.role || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveRole = async () => {
    if (!user) return;
    setSavingRole(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      setUser(data.user);
    } finally {
      setSavingRole(false);
    }
  };

  const feedbackUrl = user
    ? `${window.location.origin}/feedback/${user.username}`
    : "";

  const signatureTemplates = [
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
                  src={user?.avatarUrl || undefined}
                  alt={user?.name || "User"}
                  size="xl"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-muted">
                    {user?.role || "Vercel Employee"}
                  </p>
                  <p className="text-xs text-muted mt-1">{user?.email}</p>
                </div>
                <Link
                  href={`/feedback/${user?.username}`}
                  target="_blank"
                >
                  <Button variant="secondary" size="sm">
                    Preview page
                  </Button>
                </Link>
              </div>

              {/* Job Title Input */}
              <div className="mt-6 pt-6 border-t border-border">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title
                </label>
                <div className="flex gap-3">
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Solutions Engineer"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSaveRole}
                    disabled={savingRole || role === (user?.role || "")}
                    size="md"
                  >
                    {savingRole ? "Saving..." : "Save"}
                  </Button>
                </div>
                <p className="text-xs text-muted mt-2">
                  This will be shown on your feedback page
                </p>
              </div>
            </Card>
          </div>

          {/* Email Signature Section */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "50ms" }}
          >
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

              <div className="space-y-2 mt-6">
                {signatureTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-card-hover hover:border-[#444] transition-colors"
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

              <div className="mt-6 p-4 bg-accent/5 rounded-xl border border-accent/20 flex items-center justify-between gap-4">
                <p className="text-sm text-muted">
                  <strong className="text-foreground">Pro tip:</strong> Add your
                  feedback link to your email signature in Gmail settings.
                </p>
                <a
                  href="https://mail.google.com/mail/u/0/#settings/general"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline shrink-0"
                >
                  Open Gmail →
                </a>
              </div>
            </Card>
          </div>

          {/* Account Section */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
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
                  <a href="/api/auth/logout">
                    <Button variant="danger" size="sm" className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
