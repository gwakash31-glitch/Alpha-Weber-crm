# Alpha Weber CRM

Alpha Weber CRM is a mobile-first SaaS CRM built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Supabase/PostgreSQL.

## Capabilities

- Premium dark, responsive UI with mobile bottom navigation and desktop sidebar.
- Supabase email/password authentication for protected dashboard access.
- Lead CRUD backed by Supabase/PostgreSQL.
- Realtime lead refresh through Supabase Realtime.
- Dashboard metrics, search, status filters, and pipeline counts derived from live lead data.

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local` with Supabase public keys before enabling live authentication or persistence.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Run the schema in `lib/supabase-schema.sql` in the Supabase SQL editor before using the leads dashboard.

## Production checks

```bash
npm run lint
npm run type-check
npm run build
```

The project is a standard Next.js application and can be deployed on Vercel with the default Next.js framework preset. No custom output directory or static export configuration is required.
