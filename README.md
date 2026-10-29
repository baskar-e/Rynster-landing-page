# Rynster public website

A static-first Next.js website for Rynster product information, documentation, public media, and contact.

## Develop

```bash
npm install
npm run dev
```

## Contact delivery

The contact endpoint sends mail through Resend when all three server-side variables in `.env.example` are configured. Use a verified sender domain. The API key must never use a `NEXT_PUBLIC_` prefix.

The included per-process rate limit is a basic abuse deterrent; serverless instances do not share its state. Configure a durable provider-backed limit before relying on this endpoint for a high-traffic launch.

## Content and deployment

Public static assets live in `public/` and are versioned with the website. Update the canonical origin in `src/app/layout.tsx`, `src/app/robots.ts`, and `src/app/sitemap.ts` when the production domain is known. Check product-specific commands and client settings against the currently published Rynster release before publishing documentation changes.

Deploy as a Next.js project on Vercel. No database or visitor account system is included.
