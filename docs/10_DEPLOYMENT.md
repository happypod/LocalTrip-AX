# T-027 Deployment Notes

## Vercel Project

- Scope: `sowons-projects-e525dae5`
- Project: `localtrip-ax`
- Production URL: `https://localtrip-ax.vercel.app`
- Latest verified deployment: `https://localtrip-3qy3140jo-sowons-projects-e525dae5.vercel.app`

## Environment Variables

Verified in Vercel Production during T-039:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Pending before final public launch:

- `NEXT_PUBLIC_SITE_URL`

`NEXT_PUBLIC_SITE_URL` is public, not a secret. Set it to `https://localtrip-ax.vercel.app` while using the Vercel default domain, or to the approved custom domain after domain connection.

Preview env vars were not registered because Vercel rejects the Production Branch `main` as a Preview branch target. Add Preview variables later only for a non-production Git branch if needed.

## Build Fix

Vercel fresh install failed once because Prisma Client was not generated before `next build`.

Current build command:

```bash
npm run build
```

The script now runs:

```bash
prisma generate && next build
```

The public course client components also avoid direct Prisma runtime imports where they are not needed.

`.vercelignore` excludes local `.env` files from deployment uploads while keeping `.env.example` available for documentation.

## Verification

Local:

- `npx prisma validate`: passed
- `npm run lint`: passed with existing `<img>` LCP warnings only
- `npm run build`: passed

Production smoke test:

- `200 /`
- `200 /stays`
- `200 /stays/sowon-house-01`
- `200 /experiences`
- `200 /experiences/mallipo-sunset-walk`
- `200 /programs`
- `200 /programs/village-dining`
- `200 /courses`
- `200 /courses/sowon-one-day`
- `200 /map`
- `200 /partner/apply`
- `200 /admin`
- `200 /admin/login`
- `400 POST /api/inquiries` with empty body
- `400 POST /api/partner-applications` with empty body
- `T-031 Secret Rotation & Admin Security check passed (200 OK for /admin/* pages after login, 307 Redirect to /admin/login without cookie).`
- `T-032 Production Smoke Test passed (200 OK for all public pages, 400 validation correctly catching empty POST). Note: Admin route protection and unauthorized 307 redirects are patched locally and await Vercel deployment.`

## DB Operations

- **Production DB Schema Push**: Executed during T-029.
- **Production Seed Data**: Executed during T-030 (2026-05-12). Seed command `npx prisma db seed` was run successfully after confirming the DB was empty, populating initial demo/testing data.

Run these only after explicit operator approval for any future operations:

```bash
npx prisma db push
npx prisma db seed
```

This avoids unintended production data mutation.
