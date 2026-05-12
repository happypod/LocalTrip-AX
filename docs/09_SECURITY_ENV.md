# Security & Environment Variables

## T-026 기준

T-026은 배포 전 보안·환경변수 정리 티켓이다. 실제 배포, Vercel 프로젝트 연결, 외부 API 연동은 T-027 이후 범위다.

## 필수 환경변수

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="replace-with-strong-password"
ADMIN_SESSION_SECRET="replace-with-random-32-byte-secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- `DATABASE_URL`: Prisma Postgres 연결 문자열이다.
- `ADMIN_USERNAME`: MVP 관리자 계정 ID다.
- `ADMIN_PASSWORD`: 운영 환경에서는 강한 비밀번호로 교체한다.
- `ADMIN_SESSION_SECRET`: 관리자 세션 토큰 서명용 secret이다. 운영 환경에서는 32바이트 이상 난수 기반 값을 사용한다.
- `NEXT_PUBLIC_SITE_URL`: 클라이언트에 노출 가능한 사이트 URL이다. secret을 넣지 않는다.

## MVP에서 사용하지 않는 Placeholder

```env
# GOOGLE_MAPS_API_KEY=""
# OPENAI_API_KEY=""
```

지도 API와 AI API는 MVP에서 실제 호출하지 않는다. 키가 필요해지는 시점은 Post-MVP 또는 별도 확장 티켓에서 다시 정의한다.

## Git 관리 원칙

- `.env.example`만 커밋한다.
- `.env`, `.env.local`, `.env.*.local`은 커밋하지 않는다.
- 실제 관리자 비밀번호, DB 비밀번호, API key, session secret은 문서에 적지 않는다.
- `NEXT_PUBLIC_` 접두사가 붙은 값은 브라우저에 노출될 수 있으므로 secret에 사용하지 않는다.

## 관리자 보안 기준

- 관리자 세션 쿠키는 HTTP-only 쿠키로 저장한다.
- 세션 값은 `ADMIN_SESSION_SECRET`으로 서명하고 만료 시간을 검증한다.
- 운영 환경에서 `ADMIN_SESSION_SECRET`이 없으면 세션 발급 및 검증이 실패해야 한다.
- 관리자 화면 보호만으로 충분하지 않다. 관리자 mutation Server Action 및 관리자용 페이지(`src/app/admin/*`)는 렌더링 또는 함수 시작부에서 `requireAdminSession()`을 필수 호출한다.

### Secret Rotation 기준 (T-031 적용)

- `ADMIN_PASSWORD` 및 `ADMIN_SESSION_SECRET`은 예시값이 아닌 실서비스용 난수 및 강한 값으로 주기적으로 교체(Rotation)해야 한다.
- Secret 생성 권장 방식 (32바이트 이상 난수): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- 값은 Vercel Environment Variables를 통해 주입되며, 변경 시마다 Production 환경을 재배포(`vercel --prod`)해야 즉각 반영된다.

## 공개 API 보안 기준

- 문의와 입점신청은 개인정보 동의가 없으면 저장하지 않는다.
- 문의와 입점신청 본문 저장 실패는 성공으로 응답하지 않는다.
- 필수값, enum, 문자열 길이, 연락처/이메일 형식은 서버에서 검증한다.
- LeadEvent 저장 실패는 사용자 CTA 흐름을 막지 않는 best-effort로 처리한다.
- 응답에는 DB 오류, stack trace, 내부 구현 정보를 노출하지 않는다.

## 보안 헤더

`next.config.ts`에서 다음 최소 보안 헤더를 전역 적용한다.

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`

CSP는 이미지·스타일·Next 런타임과 충돌 가능성이 있어 MVP에서는 적용하지 않는다. Post-MVP 보안 강화 항목으로 별도 검토한다.

## T-027 배포 전 체크

- Vercel 또는 배포 환경에 필수 환경변수를 등록한다.
- production `ADMIN_PASSWORD`와 `ADMIN_SESSION_SECRET`이 `.env.example` 예시값과 다른지 확인한다.
- `npx prisma validate`, `npm run lint`, `npm run build`를 통과한다.
- `/admin` 비로그인 접근 차단, 로그인, 로그아웃 후 재차단을 확인한다.
- 문의/입점신청 동의 미체크 제출 차단을 확인한다.
