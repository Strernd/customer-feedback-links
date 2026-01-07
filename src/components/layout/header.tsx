"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme";
import { VercelLogo, Home, Settings } from "@/components/ui/icons";

interface HeaderProps {
  user?: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground hover:opacity-80 transition-opacity"
          >
            <VercelLogo className="w-5 h-5" />
            <span className="font-semibold text-sm">Feedback Links</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg
                      text-sm font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-card text-foreground"
                          : "text-muted hover:text-foreground hover:bg-card/50"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}

              {/* Theme Toggle */}
              <div className="ml-2 pl-3 border-l border-border">
                <ThemeToggle />
              </div>

              {/* User Avatar */}
              <div className="ml-2 pl-3 border-l border-border">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    {user.role && (
                      <p className="text-xs text-muted">{user.role}</p>
                    )}
                  </div>
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                  />
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
