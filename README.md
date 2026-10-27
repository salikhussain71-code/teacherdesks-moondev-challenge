# ChaseLog — Invoice Tracker for Freelancers

**A focused invoice-management application for tracking client payments, monitoring overdue invoices, and exporting invoice data.**

[Live Demo](https://teacherdesks-moondev-challenge-ik54.vercel.app) · [GitHub Repository](https://github.com/salikhussain71-code/teacherdesks-moondev-challenge)

## Overview

ChaseLog is a web application designed to help freelancers keep track of invoices and follow up on outstanding client payments. It provides a central dashboard for reviewing invoice statuses, due dates, outstanding balances, and overdue payments.

The project focuses on a practical workflow: create an invoice, monitor its status, identify late payments, and prepare a reminder message when follow-up is needed.

ChaseLog was developed as a coding-challenge project using a modern TypeScript-based web stack and a hosted Supabase backend.

## The Problem

Freelancers often manage several clients and payment deadlines simultaneously. Tracking invoice amounts, due dates, and payment status manually can lead to missed follow-ups and uncertainty about outstanding income.

ChaseLog addresses this problem by organizing invoice information in one place and making overdue payments easier to identify.

## Features

- **Invoice management:** Create and review invoices with client details, amounts, due dates, and optional notes.
- **Payment tracking:** Track invoice statuses, including outstanding and paid invoices.
- **Overdue monitoring:** Identify late invoices and display how many days they are overdue.
- **Dashboard summaries:** Review outstanding and overdue totals.
- **Authentication:** Protect authenticated areas of the application.
- **Free-tier limit:** Enforce a five-invoice limit for Free-tier users.
- **Pro demonstration:** Test the Pro workflow without processing a real subscription payment.
- **CSV export:** Download invoice data through the application's export workflow, subject to the configured tier restrictions.
- **Reminder generation:** Generate a client-facing payment reminder message using invoice information.
- **Responsive interface:** Use the application through a modern web interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and server-side routes |
| TypeScript | Type-safe application development |
| Tailwind CSS | Interface styling |
| Supabase Auth | User authentication |
| Supabase Database | Persistent application data and database-level rules |
| Vercel | Application deployment |
| Node.js | Development and test execution |

## How It Works

1. A user opens the application and signs in.
2. The dashboard displays the user's invoice information and payment summaries.
3. The user creates invoices with client names, amounts, due dates, and optional notes.
4. The application uses invoice status and due dates to identify overdue payments.
5. The user can generate a reminder message for an outstanding invoice.
6. The CSV export workflow allows eligible users to download invoice data.
7. The Pro demonstration enables evaluation of the application's higher-tier workflow without a real payment processor.

## Access Control and Data Handling

ChaseLog uses Supabase authentication and server-side application routes to protect user workflows.

The Free-tier invoice limit is enforced at the database level. The CSV export endpoint checks subscription-tier eligibility before returning invoice data. Database permissions and the upgrade workflow are designed to prevent subscription restrictions from depending solely on frontend controls.

The Pro upgrade is a demonstration feature; it does not charge a payment method or establish a real paid subscription.

Users should not place credentials, private API keys, or other secrets in source code or public repository files. Environment-specific configuration belongs in local environment files or the appropriate hosting-provider environment settings.

## Local Development

### Prerequisites

- Node.js and npm
- A Supabase project
- Git (optional, for cloning the repository)

### Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/salikhussain71-code/teacherdesks-moondev-challenge.git
cd teacherdesks-moondev-challenge
npm install
```

Create a local `.env.local` file using the variable names documented in `.env.example`. Add the values for your own Supabase project. Do not commit `.env.local` or expose private credentials.

Configure the required database schema and policies in Supabase before testing authenticated workflows.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Available scripts depend on the repository's `package.json`. Check that file for the exact commands supported by the current project.

## Testing

The deployed application was tested using the repository's smoke-test script:

```bash
node scripts/smoke-test.mjs https://teacherdesks-moondev-challenge-ik54.vercel.app
```

**Result: All seven smoke-test checks passed.**

The checks covered:

1. Home page loads successfully.
2. Login page loads successfully.
3. Dashboard redirects when the user is logged out.
4. CSV export is blocked when the user is logged out.
5. Reminder generation is blocked when the user is logged out.
6. Invalid reminder identifiers are rejected.
7. Unknown pages return a 404 response.

Manual testing also covered invoice creation, overdue invoice display, Free-tier limits, the Pro demonstration, CSV downloading, and reminder-message generation.

These tests provide useful coverage of the tested workflows; they do not guarantee that every possible edge case or security issue has been eliminated.

## Project Scope and Limitations

ChaseLog is a focused invoice-tracking demonstration, not a full accounting platform.

- It does not process invoice payments.
- The Pro upgrade is simulated and does not use a payment processor.
- Reminder generation prepares message text; it does not automatically send messages through external services.
- CSV export covers the invoice data supported by the current implementation. It should not be interpreted as a complete export of every category of user data unless those categories are explicitly implemented and tested.

## Deployment

The application is deployed on Vercel and uses Supabase for authentication and data storage.

**Live application:**  
https://teacherdesks-moondev-challenge-ik54.vercel.app

**Source code:**  
https://github.com/salikhussain71-code/teacherdesks-moondev-challenge

## What I Learned

This project strengthened my understanding of building and deploying a full-stack web application, connecting authentication to persistent data, implementing access restrictions beyond the frontend, and testing application behavior after deployment.

It also reinforced the importance of clearly defined product scope, automated smoke tests, manual verification, and careful handling of environment variables and credentials.

## Acknowledgements

Built by Salik Hussain as a coding-challenge project.

