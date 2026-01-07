# Customer Feedback Links

Internal tool for Vercelians to collect customer feedback via personalized links.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- Drizzle ORM + Neon Postgres
- Sign in with Vercel (OIDC)

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Push schema to database (creates/updates tables)
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Environment Variables

Create `.env.local`:

```env
VERCEL_CLIENT_ID=cl_xxx
VERCEL_CLIENT_SECRET=xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgres://...
```

## Sign in with Vercel Setup

1. Create OAuth app at Vercel Dashboard → Account Settings → OAuth Applications
2. Set callback URL: `{NEXT_PUBLIC_APP_URL}/api/auth/callback`
3. Enable scopes: `openid`, `email`, `profile`
4. Grant type: Authorization Code

## Routes

- `/` - Landing page
- `/login` - Sign in page
- `/dashboard` - View received feedback (protected)
- `/settings` - Email signature snippets (protected)
- `/feedback/[username]` - Public feedback form
