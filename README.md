# Customer Feedback Links

Internal tool for Vercelians to collect anonymous customer feedback via personalized links.

## Features

- **Sign in with Vercel** - Vercelians authenticate with their Vercel account
- **Personalized feedback links** - Each Vercelian gets a unique `/feedback/[username]` URL
- **Email signature snippets** - Copy-paste HTML links for Gmail signatures
- **Anonymous by default** - Customers can optionally identify themselves or sign in with Vercel
- **Sentiment tracking** - Positive, neutral, or negative feedback with comments

## Setup

### 1. Create a Vercel OAuth Application

1. Go to [Vercel Dashboard](https://vercel.com/account/oauth-apps) → Account Settings → OAuth Applications
2. Click **Create Application**
3. Fill in the details:
   - **Name**: Customer Feedback Links
   - **Redirect URIs**:
     - `http://localhost:3000/api/auth/callback` (development)
     - `http://localhost:3000/api/auth/submitter/callback` (development)
     - `https://your-domain.vercel.app/api/auth/callback` (production)
     - `https://your-domain.vercel.app/api/auth/submitter/callback` (production)
4. Under **Grant Types**, ensure **Authorization Code** is checked
5. Under **Permissions → Scopes**, enable:
   - `openid`
   - `email`
   - `profile`
6. Save and copy the **Client ID** and **Client Secret**

### 2. Create a Neon Database

1. Go to [Neon](https://neon.tech) and create a new project
2. Copy the connection string

### 3. Configure Environment Variables

Create `.env.local` for local development:

```env
VERCEL_CLIENT_ID=cl_xxxxxxxxxx
VERCEL_CLIENT_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgres://user:pass@host/db?sslmode=require
```

For production, add these same variables in your Vercel project settings.

### 4. Set Up the Database

```bash
npm install
npm run db:push
```

### 5. Run the App

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## Tech Stack

- [Next.js 14](https://nextjs.org) - React framework
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM
- [Neon](https://neon.tech) - Serverless Postgres
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Sign in with Vercel](https://vercel.com/docs/security/sign-in-with-vercel) - Authentication
