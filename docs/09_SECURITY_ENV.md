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

## T-060 AI 환경변수 기준

AI 실제 연동은 Post-MVP 별도 구현 티켓에서만 활성화한다. T-060 기준으로는 아래 값이 문서화 기준이며, 기본값은 비활성 상태다.

```env
AI_FEATURES_ENABLED="false"
AI_PROVIDER="disabled"
AI_MODEL=""
AI_API_KEY=""
AI_DAILY_BUDGET_KRW="10000"
AI_MAX_REQUESTS_PER_HOUR="30"
AI_MAX_INPUT_CHARS="6000"
AI_MAX_OUTPUT_CHARS="3000"
AI_REQUIRE_ADMIN_APPROVAL="true"
```

- `AI_FEATURES_ENABLED`: 전체 AI 기능 kill switch다. 운영 승인 전에는 `false`를 유지한다.
- `AI_PROVIDER`: `disabled`, `openai`, `gemini` 등 provider adapter의 식별자다.
- `AI_MODEL`: 운영자가 비용과 품질을 승인한 모델 id다.
- `AI_API_KEY`: 서버 전용 secret이다. `NEXT_PUBLIC_` 접두사를 붙이면 안 된다.
- `AI_DAILY_BUDGET_KRW`: 일일 예상 비용 상한이다.
- `AI_MAX_REQUESTS_PER_HOUR`: 관리자 기준 또는 전체 서비스 기준 시간당 호출 제한이다.
- `AI_MAX_INPUT_CHARS`, `AI_MAX_OUTPUT_CHARS`: 과도한 토큰 사용을 막기 위한 문자 수 제한이다.
- `AI_REQUIRE_ADMIN_APPROVAL`: AI 결과를 운영자가 승인하기 전 저장·공개하지 않기 위한 안전장치다.

AI 호출에는 문의자명, 연락처, 이메일, 입점신청자 정보, 관리자 secret, 세션 쿠키, DB URL을 포함하지 않는다. 상세 기준은 `docs/18_AI_INTEGRATION_PLAN.md`를 따른다.

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

## Rate Limit 및 WAF 설정 가이드 (T-072)

공개 API가 악의적 봇이나 과도한 트래픽으로 오염되는 것을 방지하기 위해 2단계 보호 전략을 적용합니다.

### 1. 인메모리 Rate Limit (앱 내부 보조 방어)
현재 소스 코드(`src/lib/public-api-rate-limit.ts`) 내부에 간단한 in-memory Rate Limiting 헬퍼를 적용했습니다.
- Vercel Serverless 환경에서는 인스턴스 단위로 제한 카운트가 분산되므로 전역 방어가 완벽하게 보장되지는 않습니다. (Local / 보조 목적)
- IP 추출 시 `x-forwarded-for`를 우선 참조하며 로깅 시 IP를 마스킹 처리하여 프라이버시를 보호합니다.
- 초과 시 문의/신청 API는 `429 TOO_MANY_REQUESTS`를 반환하고, `lead-events` API는 사용자 여정을 방해하지 않도록 `{ ok: true, skipped: true }` 처리됩니다.

### 2. Vercel WAF (운영 주 방어)
실제 Production 운영 시 Vercel Dashboard의 Web Application Firewall(WAF) 설정에서 IP 기반 Rate Limit 룰을 생성해야 합니다.

- `/api/inquiries`: IP당 1분 / 5회
- `/api/partner-applications`: IP당 10분 / 3회
- `/api/premium-pr-applications`: IP당 10분 / 3회
- `/api/lead-events/*`: IP당 1분 / 60회

## 관리자 페이지 인증 선검증 기준 (T-073)

관리자(/admin) 전용 화면의 접근 보안을 강화하기 위해 1, 2차 관문 구조를 전역적으로 엄수합니다.

### 1. DB 조회 전 인증 선검증 (1차 필수 방어)
모든 `/admin/**/*.tsx` (서버 컴포넌트) 및 `**/actions.ts` (서버 액션) 파일에서는 **DB 조회(`getPrisma()`, `prisma.xxx`)를 유발하기 전에 반드시 `requireAdminSession()`을 먼저 선행 호출**해야 합니다.
- 비인가자가 페이지를 직진입했을 때, 불필요하게 운영 DB 데이터를 Select/Fetch 하는 공격 벡터를 원천 차단합니다.
- 인증 실패 시 세션 모듈 내에서 즉각 `/admin/login`으로 307 리다이렉트가 유발되며 이후의 DB 코드는 실행되지 않습니다.

### 2. AdminShell 적용 (2차 렌더링 방어)
최종 JSX 렌더링 레이어는 반드시 `<AdminShell>` 컴포넌트로 감싸줍니다.
- `<AdminShell>`은 렌더링 단계에서 비정상적인 세션 위변조를 최종 방어하고 공통 네비게이션 레이아웃과 세션 username 상태를 렌더링하는 역할을 병행 수행합니다.
- 1차 선검증이 누락된 경우의 최후의 보루(Fail-safe)입니다.

### 3. 영역의 분리
- `/admin`은 관리자와 현장운영 전용 계정 공간입니다.
- 관광객 본인의 리뷰나 위시리스트 등을 담는 관광객 마이페이지 영역은 향후 `/my` 경로로 물리적으로 분리되며, 어드민 세션 스키마를 절대 혼용하지 않습니다.

## 보안 헤더

`next.config.ts`에서 다음 최소 보안 헤더를 전역 적용한다.

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`
- `Content-Security-Policy`: (T-077 반영 사항) 기본적으로 `default-src 'self'`를 유지하되, Next.js 스타일/스크립트 런타임과 네이버 지도를 위해 `script-src` 및 `style-src`에 `'unsafe-inline'` 등을 허용합니다.
  - 외부 임베드(`frame-src`) 허용 목록: `https://my.matterport.com`, `https://www.youtube.com`, `https://www.youtube-nocookie.com`, `https://player.vimeo.com`
  - 네이버 지도(`script-src`, `img-src`, `connect-src`): `https://openapi.map.naver.com`, `https://*.pstatic.net`

Premium PR의 `iframe` 렌더링 시에는 `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"` 속성을 필수로 부여하여 과도한 권한 탈취를 방지합니다.

## T-027 배포 전 체크

- Vercel 또는 배포 환경에 필수 환경변수를 등록한다.
- production `ADMIN_PASSWORD`와 `ADMIN_SESSION_SECRET`이 `.env.example` 예시값과 다른지 확인한다.
- `npx prisma validate`, `npm run lint`, `npm run build`를 통과한다.
- `/admin` 비로그인 접근 차단, 로그인, 로그아웃 후 재차단을 확인한다.
- 문의/입점신청 동의 미체크 제출 차단을 확인한다.

## DB 연결 및 운영 로그 가이드 (T-074)

### 1. Vercel / Neon 커넥션 풀링 분리 정책
Vercel Serverless 환경에서는 다수 인스턴스가 동시다발적으로 구동되어 DB 연결 폭증 현상(Connection Timeout/Maxed out)이 발생하기 쉽습니다. 이를 예방하고자 연결 통로를 이원화합니다.

1. **`DATABASE_URL` (런타임 앱 전용)**
   - Vercel 서버리스 상에서 구동되는 실제 Next.js 앱 런타임이 호출하는 주소입니다.
   - Neon의 **Connection Pooler** 연결 링크(예: `?pgbouncer=true`가 포함되거나 특정 풀 전용 호스트)를 사용하여 커넥션 재사용성을 확보합니다.
2. **`DIRECT_URL` (관리/배포 작업 전용)**
   - CLI 환경 또는 CI/CD 파이프라인에서 이루어지는 `prisma db push`, `prisma db seed`, 마이그레이션 명령처럼 단발성이며 트랜잭션 분할이 어려운 작업들을 위한 **비-풀러 직접 연결** 주소입니다.

> [!WARNING]
> `.env` 파일이나 문서 상에 실제 데이터베이스 커넥션 스트링(`postgresql://...`) 원본을 절대 기록하여 커밋하지 마십시오. 반드시 배포 콘솔(Vercel Environment Variables)이나 로컬 비공개 파일로 취급해야 합니다.

### 2. Prisma Client 로깅 제한 규정
운영(Production) 환경의 Vercel 로그 버퍼에 민감 데이터(개인정보, 상세 쿼리구문)가 무분별하게 노출되는 리스크 및 로그 처리량 비용을 절약하기 위해 환경별 출력을 차단합니다.

- **기본 구현 원칙**: `src/lib/prisma.ts`
```typescript
const isDev = process.env.NODE_ENV === "development";
globalForPrisma.prisma = new PrismaClient({
  adapter,
  log: isDev ? ["query", "warn", "error"] : ["warn", "error"],
});
```
- **운영(Production)**: `query` 로그를 원천 비활성화하여 `warn`, `error` 수준으로만 노출 범위를 좁힙니다.
- **운영 디버깅 시**: 긴급한 성능 파악이나 쿼리 점검이 필요할 때에만 일시적으로 `"query"`를 추가하여 빌드/배포 후, 이슈 해소 즉시 원복(Rollback) 처리해야 합니다.

