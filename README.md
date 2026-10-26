# ChaseLog

Overdue-invoice tracker for freelancers. Next.js 15 + TypeScript + Tailwind CSS 4 + Supabase.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key
3. Run `supabase/schema.sql` in the Supabase SQL Editor
4. `npm run dev` then open http://localhost:3000

## How the paid gate works
- `profiles.tier` ('free' | 'pro') has RLS with SELECT only, so users cannot update it.
- Tier changes only through the `set_my_tier()` SQL function (the simulated payment).
- Free plan: a database trigger blocks the 6th invoice, so it cannot be bypassed from the UI or API.
- Pro-only CSV export: `/api/export` checks the tier on the server and returns 403 otherwise.
