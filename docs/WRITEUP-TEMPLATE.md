# Write-up (target 300-500 words; rewrite in YOUR words and numbers)

**Problem and user.** Freelancers invoice several clients at once and lose track of who is late. ChaseLog shows the money still owed, what is overdue and by how many days. The user is a solo freelancer with 5-30 open invoices who currently uses a spreadsheet or memory.

**What I decided not to build.** Real payments (the brief allows simulating the upgrade, and Stripe would consume days of the week), automatic email sending (deliverability and consent are a product of their own, so I generate reminder text to copy instead), multi-currency, and team accounts. Each would widen scope without proving the core idea.

**Biggest technical decision.** I enforced the paid tier in Postgres instead of only in the UI. profiles.tier is readable but not writable by users (Row Level Security), changes only through a security-definer function standing in for payment, and a trigger rejects the 6th invoice on the free plan. Pro-only CSV export and reminder routes re-check the tier on the server. Tradeoff: more SQL and harder local testing, and business rules live in the database rather than in TypeScript. In return, a user calling the API directly cannot bypass the gate.

**Other tradeoffs.** Server components and server actions keep the bundle small and secrets off the client, at the cost of less instant UI feedback than a client-side app. Email/password only, no social login, to keep the auth surface small.

**What I would do next.** Real Stripe webhooks to set the tier, scheduled email reminders, and tests for the SQL policies.
