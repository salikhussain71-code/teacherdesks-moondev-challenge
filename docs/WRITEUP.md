# ChaseLog — MoonDev 2026 Coding Challenge

## The problem and user

ChaseLog is an invoice-tracking application for freelancers who need a straightforward way to monitor client payments. Freelancers may handle several clients at once, making it difficult to remember invoice amounts, due dates, and overdue payments. ChaseLog brings this information into one dashboard, displaying outstanding balances, overdue totals, invoice statuses, and the number of days a payment is late. Users can create invoices with client names, amounts, due dates, and optional notes. The objective is to make tracking payments and following up with clients easier.

## What I decided not to build

I focused on the core invoice-management workflow instead of building a complete accounting platform. ChaseLog does not process real payments, replace bookkeeping software, or send automated messages through external messaging services. Its Pro upgrade is a demonstration rather than a real subscription transaction. These limits kept the scope manageable while allowing the main invoice, access-control, and export workflows to be evaluated.

## The biggest technical decision

I used Next.js and TypeScript to structure the application, Tailwind CSS for styling, and Supabase for authentication and database storage. One important decision was to enforce subscription restrictions beyond the user interface. The database trigger enforces the five-invoice limit for the Free tier, while the server-side CSV export endpoint checks the user's tier before returning invoice data. Database permissions restrict direct changes to the profile tier, and a database function supports the simulated upgrade. This design makes the restrictions more robust than simply hiding buttons in the interface.

## Tradeoffs

The main tradeoff was prioritizing a focused, testable application over a larger product with real billing and external integrations. A simulated upgrade lets evaluators test the Pro workflow without a payment processor. The application is deployed on Vercel and connected to Supabase.

I ran the supplied smoke-test script against the live deployment, and all seven automated checks passed. These checks covered page loading, authentication redirects, access restrictions for logged-out users, export and reminder protection, invalid reminder identifiers, and unknown-page handling. Manual testing also covered invoice creation, overdue status, the five-invoice Free limit, the Pro upgrade, CSV downloads, and reminder-message generation.

This project helped me understand the importance of enforcing access rules on the server and in the database rather than relying entirely on the frontend. It also demonstrated why automated checks and hands-on testing are both valuable when preparing a deployed application for evaluation.
