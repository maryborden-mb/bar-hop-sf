# Bar Hop SF

A personal journal for San Francisco bars: log where you've been, how you felt about each bar, and which ones you'd revisit.

**Live app:** https://bar-hop-sf.vercel.app

Hosted on Vercel. Every merge to `main` deploys automatically.

See `PLAN.md` for the full plan and `schema.md` for the database tables.

## What it does

Each person signs up for their own private account, then can:

- **Journal:** log bars you've been to with a neighborhood, type, 1–5 rating, whether you'd go back, outdoor seating, vibe, and notes. Add, view, edit, and delete them.
- **Search, filter, and sort** your Journal by name or notes, neighborhood, type, and "good for" tags (sunny, watching sports, big groups, food), sorted by newest, highest rated, or A–Z.
- **Favorites:** star your go-to bars and see them in one place.
- **Wishlist:** save bars you want to try, then mark them visited later.
- **Dashboard:** a chart of bars per neighborhood, plus total bars, average rating, and the percent you'd go back to.
- **Map:** a drawn map of SF neighborhoods. Click one to see your bars there.
- **Pick a bar for tonight:** a random pick from your bars rated 4 or higher, optionally in one neighborhood.

Your bars are private: the database itself only lets each user see their own.

## Tools used

| Tool | What it's for | Why |
|---|---|---|
| [Claude Code](https://claude.com/claude-code) | AI coding agent that built the app | Runs git and GitHub commands itself, so each Issue → branch → PR loop is fast |
| [Next.js](https://nextjs.org) 16 (React, TypeScript) | The web app framework | Widely used, so the agent knows it well, and it deploys to Vercel with no extra setup |
| [Supabase](https://supabase.com) | Postgres database and sign up / login (email + password) | A real relational database with built-in auth, and its row-level security keeps each user's bars private |
| [Vercel](https://vercel.com) | Hosting | Redeploys automatically on every merge to `main` |
| [Recharts](https://recharts.org) | The Dashboard chart | A simple React chart library, enough for one bar chart |
| [Vitest](https://vitest.dev) | Tests | A lightweight test runner that works with Next.js |
| [Tailwind CSS](https://tailwindcss.com) + custom CSS | Styling | Came with the Next.js setup; the look (burgundy and gold art-deco wallpaper, menu-card pages) is custom CSS in `src/app/globals.css` |
| GitHub | Code, Issues, and pull requests | Every change went through an Issue, a branch, and a PR; key prompts are saved in `prompts/` |

## Running it locally

You need Node.js 24 and a Supabase project.

1. Copy `.env.example` to `.env.local` and fill in your Supabase Project URL and publishable key (Supabase dashboard → Project Settings → API Keys).
2. Set up the database: run each file in `supabase/migrations/`, oldest first, in the Supabase dashboard (SQL Editor → New query → paste → Run).
3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000.

## Tests

Unit tests (fast, no network):

```bash
npm test
```

Data isolation test (PLAN.md test 1). It runs against the real Supabase project in `.env.local`: it creates two throwaway accounts and checks that one user can never read, edit, delete, or star the other's bars. It needs:

- **Confirm email** turned off in Supabase (Authentication → Sign In / Providers → User Signups)
- `TEST_EMAIL` in `.env.local` set to an address you own. Test accounts use `+` tags on it (`you+bar-hop-test-a-…@domain`), because Supabase rejects made-up domains like example.com

```bash
npm run test:isolation
```
