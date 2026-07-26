# Alpha Weber CRM

Alpha Weber CRM is a mobile-first SaaS CRM and Business Growth Operating System built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Supabase/PostgreSQL.

## Production Capabilities

- Protected admin login/logout with persisted Supabase sessions.
- Supabase-backed lead management with create, read, update, delete, search, filters, sorting, pagination, notes, realtime updates, and confirmation dialogs.
- Live dashboard statistics, pipeline counters, activity feed, and notifications from Supabase data.
- Dark responsive UI with desktop sidebar, mobile bottom navigation, preserved branding, and Framer Motion animations.
- Database schema with `users`, `profiles`, `leads`, `lead_notes`, `activities`, `settings`, and `notifications` tables, indexes, constraints, RLS policies, and realtime publications.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the following environment variables in `.env.local` and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_JWKS_URL=
```

Do not expose or commit Supabase secret keys. The browser app only needs the publishable key because database access is protected by Supabase Auth and Row Level Security.

## Database Setup

Run `lib/supabase-schema.sql` in the Supabase SQL editor for the project before using the CRM. Then create an admin user in Supabase Auth. The database trigger automatically creates that user's CRM `users`, `profiles`, and default `settings` rows.

## Quality Checks

```bash
npm run type-check
npm run lint
npm run build
```
