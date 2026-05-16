# T-040 Pre-Launch Checklist

Last updated: 2026-05-13 (Asia/Seoul)

This checklist is the launch-readiness record for LocalTrip AX / 소원로컬트립 MVP. Do not write real secrets, passwords, database URLs, API keys, or session secrets in this file.

## 1. Project Status

| Item | Status |
|---|---|
| Project | LocalTrip AX / 소원로컬트립 MVP |
| Service type | 문의·연결 중심 지역관광 운영 플랫폼 |
| Hosting | Vercel |
| Production URL | `https://localtrip-ax.vercel.app` |
| Vercel project | `sowons-projects-e525dae5/localtrip-ax` |
| Database | Neon PostgreSQL |
| Final check date | 2026-05-13 |
| Launch decision | 조건부 출시 승인 |

## 2. Launch Decision

**Decision: 조건부 출시 승인**

The MVP can be used for internal validation, stakeholder review, and limited pilot operation on the current Vercel URL. Before broad public promotion, QR distribution, printed materials, or official launch, complete the remaining P2 items below.

Decision basis:

- Core public pages and selected production routes return `200 OK`.
- `/admin` redirects unauthenticated users to `/admin/login` with `307 Temporary Redirect`.
- `npx prisma validate`, `npm run lint`, and `npm run build` pass locally.
- The MVP keeps the inquiry/connection model and does not introduce payment, settlement, confirmed reservation, transport booking, review, coupon, point, or real AI API flows.
- Remaining launch blockers are not application-breaking, but `NEXT_PUBLIC_SITE_URL` and final real-device checks should be completed before public launch.

## 3. MVP Scope Compliance

| Requirement | Status | Note |
|---|---|---|
| 문의·연결 중심 플랫폼 | Pass | CTA routes users to phone/Kakao/Naver/website/inquiry flows |
| 결제 제외 | Pass | No payment flow is part of MVP |
| 정산 제외 | Pass | No settlement flow is part of MVP |
| 실시간 예약 확정 제외 | Pass | No booking-confirmation flow is part of MVP |
| 실시간 객실 재고 제외 | Pass | No inventory engine is part of MVP |
| 차량/운송 예약 제외 | Pass | `/map` states it is not transport booking |
| 후기 시스템 제외 | Pass | Wishlist is local UX only, not review |
| 쿠폰/포인트 제외 | Pass | Event copy may mention promotion, but no coupon/point system exists |
| AI 실제 API 연동 제외 | Pass | `/admin/ai-assistant` is a placeholder |
| AX 확장 포인트 유지 | Pass | Placeholder and roadmap docs remain |

## 4. Production URL And Domain

### Current URL

- Current Production URL: `https://localtrip-ax.vercel.app`
- T-039 decision: keep Vercel default domain for MVP validation.
- External public promotion should use a custom domain after operator approval.

### Production HEAD Check

Checked on 2026-05-13 KST:

| Route | Result |
|---|---|
| `/` | `200 OK` |
| `/stays` | `200 OK` |
| `/experiences` | `200 OK` |
| `/programs` | `200 OK` |
| `/courses` | `200 OK` |
| `/map` | `200 OK` |
| `/partner/apply` | `200 OK` |
| `/customer-center` | `200 OK` |
| `/events` | `200 OK` |
| `/admin` unauthenticated | `307 Temporary Redirect` to `/admin/login` |

### Domain Decision

- MVP validation: keep `https://localtrip-ax.vercel.app`.
- Public promotion: connect a custom domain first.
- Candidate domains remain undecided: `sowontrip.kr`, `localtrip-ax.kr`, `trip.sowon.kr`.
- DNS changes must not be made without operator approval.

## 5. Environment Variables

Vercel Production env list checked on 2026-05-13:

| Variable | Production Status | Secret? | Launch Note |
|---|---|---|---|
| `DATABASE_URL` | Present | Yes | Do not document value |
| `ADMIN_USERNAME` | Present | Yes | Do not document value |
| `ADMIN_PASSWORD` | Present | Yes | Do not document value |
| `ADMIN_SESSION_SECRET` | Present | Yes | Do not document value |
| `NEXT_PUBLIC_SITE_URL` | Missing | No | Add before public launch |

Required action before public launch:

- Add `NEXT_PUBLIC_SITE_URL=https://localtrip-ax.vercel.app` to Vercel Production while the Vercel default domain is canonical.
- If a custom domain is connected first, set `NEXT_PUBLIC_SITE_URL` to that custom origin instead.
- Redeploy after changing Vercel Production env vars.

Local note:

- Local `.env` contains `NEXT_PUBLIC_SITE_URL`, but it does not match the current Production URL. This is acceptable only for local development if it intentionally targets localhost or another local origin.

## 6. Database Checklist

| Item | Status | Evidence |
|---|---|---|
| Prisma schema validate | Pass | `npx prisma validate` passed on 2026-05-13 |
| Neon connection configured | Pass | `DATABASE_URL` exists in Vercel Production |
| Production schema push | Done | Recorded in `docs/10_DEPLOYMENT.md` as T-029 |
| Production seed | Done | Recorded in `docs/10_DEPLOYMENT.md` as T-030 |
| Region slug `sowon` | Expected | Required by public/admin region scoping |
| `Region.slug` required | Pass | `slug String @unique` |
| Major public models use `regionId` | Pass | Region-based design retained |
| `images` default array | Pass | Public content image arrays use `@default([])` |
| Public query index | Pass | Main public models include `@@index([regionId, status])` |
| LeadEvent analytics index | Pass | `@@index([regionId, eventType, createdAt])` |
| Neon connection pooling | Pass | `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) are planned/configured |
| Prisma query log limitation | Pass | `query` logs are restricted to Development mode via `NODE_ENV` check |

Operational rule:

- Do not run `prisma db push` or `prisma db seed` against Production without explicit operator approval.

## 7. Public Page Checklist

| Route | Check |
|---|---|
| `/` | Home loads and category/content sections render |
| `/stays` | Published accommodations only |
| `/stays/[slug]` | Detail CTA is connection/inquiry oriented |
| `/experiences` | Published experiences only |
| `/experiences/[slug]` | Detail CTA is connection/inquiry oriented |
| `/programs` | Published LocalIncomeProgram items only |
| `/programs/[slug]` | LocalIncomeProgram remains distinct from Experience |
| `/courses` | Published courses only |
| `/courses/[slug]` | Non-published linked items are excluded |
| `/map` | Placeholder map is clear; no real transport booking promise |
| `/partner/apply` | Privacy agreement is required |
| `/customer-center` | Inquiry form is available and privacy-gated |
| `/events` | DB-backed event layout is stable and empty state is available |

Public data policy:

- Public screens should show `status=published` only.
- `draft` and `inactive` data must remain hidden.
- Payment/reservation-confirmation wording must not be introduced.

## 8. Admin Checklist

| Area | Status |
|---|---|
| `/admin` route protection | Pass |
| Login/logout routes | Pass |
| Signed admin session cookie | Pass |
| `httpOnly` cookie | Pass |
| `secure` cookie in production | Pass |
| `sameSite=lax` | Pass |
| Admin Server Actions call `requireAdminSession()` | Pass by search |
| Region/BusinessProfile CRUD | Implemented |
| Accommodation CRUD | Implemented |
| Experience CRUD | Implemented |
| LocalIncomeProgram CRUD | Implemented |
| Course CRUD | Implemented |
| Event CRUD | Implemented with `sowon` region scope and published-only public policy |
| Inquiry/PartnerApplication management | Implemented with masking/preview policy |
| Training/Certification management | Implemented |
| AI assistant placeholder | Implemented |
| Collapsed admin sidebar | Icons remain visible |

Admin model:

- Current admin is platform/operator admin.
- Lodging/experience provider self-service dashboards are not part of the MVP and should be treated as Post-MVP role/tenant expansion.

## 9. Privacy And Security Checklist

| Item | Status |
|---|---|
| Inquiry privacy consent required | Pass |
| Partner application privacy consent required | Pass |
| Public API validation returns 400 for invalid input | Pass |
| Save failure is not reported as success | Pass |
| LeadEvent failure is best-effort | Pass |
| Admin list masking for names/phone/email | Pass |
| Long message body not sent to list UI | Pass |
| Detail message access requires admin session | Pass |
| Minimum security headers configured | Pass |
| Real secrets excluded from docs | Pass |
| Vercel WAF / Rate Limit 룰 구성 (T-072/T-090) | Pending Approval | Dashboard 적용 전, 초안 문서화 완료 |
| Admin DB access require pre-validation (T-073) | Pass |
| CSP(Content-Security-Policy) 적용 (T-077) | Pass |

Remaining security follow-up:

- 추가적인 CSP 강화(inline script 제거 등)는 Post-MVP 이후 점진적으로 도입합니다.

## 10. LeadEvent Checklist

Expected tracked events:

- Phone click
- Kakao click
- Naver booking click
- Website click
- Inquiry submit
- Partner application submit
- Map click

Expected data:

- `regionId`
- `eventType`
- `targetType`
- `targetId`
- `targetSlug`
- `sourcePath`
- `targetUrl` where applicable

Policy:

- LeadEvent must never block user CTA navigation or form success when the main form save succeeds.

## 11. QA Summary

| Ticket | Status | Note |
|---|---|---|
| T-033 Viewport QA | Pass with follow-up | Desktop/mobile viewport checked; actual devices remain follow-up |
| T-034 Public Data Exposure QA | Pass | Published-only policy checked |
| T-035 Privacy/Inquiry/Partner QA | Pass | Consent and masking policy checked |
| T-036 Image/Fallback QA | Pass | URL failure fallback unified |
| T-037 Map Placeholder QA | Pass | Placeholder and filter behavior checked |
| T-038 Accessibility Basic QA | Pass | Basic labels/focus semantics improved |
| T-039 Domain Decision | Pass with action item | Custom domain deferred; `NEXT_PUBLIC_SITE_URL` pending |

## 12. Known Issues

### P1: Launch Blockers

- None currently identified for MVP validation/pilot use.

### P2: Fix Before Broad Public Launch

- Add `NEXT_PUBLIC_SITE_URL` to Vercel Production and redeploy.
- Run real iOS/Android/PC device checks before public promotion.
- Event operating content now follows T-069 to T-071: `regionId + status=published` public policy and safe href/gradient fallback.
- Decide whether to connect a custom domain before QR/printed/public materials.

### P3: Post-Launch Improvements

- Remaining `<img>` LCP warnings in `StayImage` and `ExperienceImage`; current fallback behavior is correct, but performance optimization can move to `next/image`.
- CSP hardening.
- Provider/operator role-based dashboards.
- Persona theme/i18n pack implementation from T-041 onward.
- Premium PR/B2B BM expansion tickets.

## 13. Final Approval

| Decision | Meaning |
|---|---|
| 조건부 출시 승인 | MVP validation/pilot can proceed on Vercel default URL |

Required before broader public launch:

1. Add `NEXT_PUBLIC_SITE_URL` to Vercel Production.
2. Confirm real device QA.
3. Decide custom domain timing.
4. Re-run smoke checks after any env/domain/deployment change.

## 14. Automated Smoke Test

T-076 adds an operator smoke-test script that can be run against local or Production URLs.

Command:

```bash
npm run smoke
```

Production check:

```bash
SMOKE_BASE_URL=https://localtrip-ax.vercel.app npm run smoke
```

PowerShell:

```powershell
$env:SMOKE_BASE_URL="https://localtrip-ax.vercel.app"; npm run smoke
```

The script checks:

- Public routes return `200`: `/`, `/stays`, `/experiences`, `/programs`, `/courses`, `/events`, `/map`, `/partner/apply`, `/partner/premium-pr`, `/customer-center`, `/my`, `/course-builder`.
- Admin routes redirect unauthenticated users to `/admin/login`: `/admin`, `/admin/stays`, `/admin/inquiries`.
- Public form APIs reject invalid empty `POST {}` payloads: `/api/inquiries`, `/api/partner-applications`, `/api/premium-pr-applications`.
- `/api/lead-events` is checked as best-effort and reports a warning rather than failing the run.

Acceptance:

- Run this after every Production deployment, DB connection change, env change, and domain change.
- Any `[FAIL]` result blocks broad public launch until resolved.
- `[WARN]` slow-route results should be reviewed before external promotion.
