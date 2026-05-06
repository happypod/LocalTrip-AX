# T-027 Deployment Notes

## Vercel Project

- Scope: `sowons-projects-e525dae5`
- Project: `localtrip-ax`
- Production URL: `https://localtrip-ax.vercel.app`
- Latest verified deployment: `https://localtrip-3qy3140jo-sowons-projects-e525dae5.vercel.app`

## Environment Variables

Registered in Vercel Production and Development:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

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

## DB Operations

Production DB schema push and seed were not executed during T-027.

Run these only after explicit operator approval:

```bash
npx prisma db push
npx prisma db seed
```

This avoids unintended production data mutation.
