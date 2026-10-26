# Deploy checklist

1. Supabase: create project, run supabase/schema.sql in SQL Editor.
2. Supabase: Authentication > Providers > Email > turn OFF "Confirm email" (so the evaluator can log in instantly).
3. Push to GitHub (never commit .env.local).
4. Vercel: Add New > Project > import repo. Add env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Deploy.
5. Supabase: Authentication > URL Configuration > Site URL = your Vercel URL.
6. On the live site, sign up evaluator@<anything>.com with a strong password. Add 2-3 sample invoices (one overdue), leave on Free so the evaluator can press Upgrade themselves.
7. Run: node scripts/smoke-test.mjs https://YOUR-APP.vercel.app
8. Test in a private window: free limit error on 6th invoice, upgrade, CSV, reminder, downgrade.
