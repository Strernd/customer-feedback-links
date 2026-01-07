import { Metadata } from "next";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const result = await db
    .select({
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (result.length === 0) {
    return {
      title: "Feedback | Vercel",
      description: "Leave feedback for a Vercel employee",
    };
  }

  const user = result[0];
  const title = `Give feedback to ${user.name}`;
  const description = user.role
    ? `Share anonymous feedback with ${user.name}, ${user.role} at Vercel`
    : `Share anonymous feedback with ${user.name} at Vercel`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function FeedbackLayout({ children }: Props) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Force system theme on feedback pages (ignore localStorage)
              document.documentElement.dataset.forceSystemTheme = 'true';
              document.documentElement.classList.remove('light', 'dark');
              const resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.classList.add(resolved);
            })();
          `,
        }}
      />
      {children}
    </>
  );
}
