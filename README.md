# Rynster public website

A static-first Next.js website for Rynster product information, documentation, public media, and contact.

## Develop

```bash
npm install
npm run dev
```

## Contact delivery

The contact and home page feedback endpoints send mail through Resend when all three server-side variables in `.env.example` are configured. Use a verified sender domain. The API key must never use a `NEXT_PUBLIC_` prefix.

The contact endpoint uses a basic per-process rate limit. Home page feedback uses Upstash Redis for a shared rate limit.

## Home page engagement

The public heart count uses Upstash Redis to store the aggregate and prevent repeat reactions from the same browser. Add an Upstash Redis store to the Vercel project and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for production. Local development falls back to in-memory state, which resets when the dev server restarts. Vercel Web Analytics must also be enabled in the project dashboard to see private visitor and page-view reports.

## Content and deployment

Public static assets live in `public/` and are versioned with the website. Update the canonical origin in `src/app/layout.tsx`, `src/app/robots.ts`, and `src/app/sitemap.ts` when the production domain is known. Check product-specific commands and client settings against the currently published Rynster release before publishing documentation changes.

Deploy as a Next.js project on Vercel. The site has no visitor account system; Upstash Redis stores only reaction and rate-limit data.
