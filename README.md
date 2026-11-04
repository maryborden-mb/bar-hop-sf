# Bar Hop SF

A personal journal for San Francisco bars: log where you've been, how you felt about each bar, and which ones you'd revisit.

See `PLAN.md` for the full plan.

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
