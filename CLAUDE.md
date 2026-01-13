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
SLACK_BOT_TOKEN=xoxb-...
```

## Sign in with Vercel Setup

1. Create OAuth app at Vercel Dashboard → Account Settings → OAuth Applications
2. Set callback URL: `{NEXT_PUBLIC_APP_URL}/api/auth/callback`
3. Enable scopes: `openid`, `email`, `profile`
4. Grant type: Authorization Code

## Slack App Setup

Feedback is sent directly to users via Slack DMs instead of being stored in the database.

1. Create a Slack app at https://api.slack.com/apps
2. Enable the following Bot Token Scopes under OAuth & Permissions:
   - `chat:write` - Send messages
   - `users:read.email` - Look up users by email
3. Install the app to your workspace
4. Copy the Bot User OAuth Token and add it to `.env.local` as `SLACK_BOT_TOKEN`

## Routes

- `/` - Landing page
- `/login` - Sign in page
- `/dashboard` - View your feedback link (protected)
- `/settings` - Email signature snippets (protected)
- `/feedback/[username]` - Public feedback form

## How it Works

### For Vercelians (Setting up to receive feedback):
1. Sign in and go to your dashboard
2. **REQUIRED**: Click "Auto-detect Slack Account" button to connect Slack
3. If your Slack email matches your Vercel email, you're done!
4. If not, manually enter your Slack user ID (Profile → More → Copy member ID)
5. **OPTIONAL**: Configure your manager to receive copies of feedback
6. Once Slack is configured, your feedback link becomes available
7. Add the feedback link to your email signature

### For External Customers (Submitting feedback):
1. Click the feedback link in a Vercelian's email signature
2. Fill out the feedback form
3. Submit - feedback is sent directly to Slack DM

### Feedback Delivery:
- **GDPR Compliant**: Feedback is NEVER stored in the database
- **Direct to Slack**: All feedback goes directly to Slack DMs only
- **No fallback storage**: If Slack delivery fails, the customer sees an error
- **Setup required**: Feedback links only work after Slack is configured

## Setup Your Slack Connection (REQUIRED)

Your feedback link will not work until Slack is configured:

1. Go to your dashboard
2. You'll see "Setup required" section
3. Click "Auto-detect Slack Account" button
4. If auto-detection succeeds:
   - Your Slack user ID is saved
   - Feedback link becomes visible
   - Email signature snippets appear
5. If it fails (mismatched emails):
   - Expand "Or manually enter Slack user ID"
   - In Slack: Profile → More → Copy member ID
   - Paste and save

## Manager Feedback (Optional)

You can optionally configure a manager to receive copies of all your feedback:

1. After setting up your own Slack, go to "Manager feedback (optional)" section
2. Enter your manager's email address
3. Click "Auto-detect Manager's Slack"
4. If successful, your manager is configured
5. If auto-detect fails, manually enter their Slack user ID

**Manager message format:**
- Shows who the feedback is for (e.g., "Feedback for John Doe")
- Includes the sentiment, comment, and submitter info
- Clearly labeled as "Manager copy"

**Removing a manager:**
- Click "Remove" button next to configured manager
- Manager will no longer receive copies

## Privacy & GDPR

- **No database storage**: Feedback is sent directly to Slack and never stored
- **Ephemeral only**: Feedback exists only in Slack messages
- **User control**: Each Vercelian controls their own Slack delivery and manager configuration
