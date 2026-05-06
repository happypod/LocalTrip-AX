# LocalTrip AX / 소원로컬트립 MVP

문의·연결 중심의 로컬 여행 플랫폼 MVP 프로젝트입니다.

## 프로젝트 정보
- **기술 스택**: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Prisma
- **현재 단계**: T-028 MVP 릴리즈 노트 완료

## 실행 방법

### 로컬 개발 서버 실행
```bash
npm install
npm run dev
```

### 환경변수 설정
`.env.example`을 기준으로 로컬 환경에는 `.env.local` 또는 `.env`를 별도로 구성합니다. 실제 secret은 git에 커밋하지 않습니다.

필수 변수:
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

운영 환경에서는 `ADMIN_PASSWORD`를 강한 비밀번호로 바꾸고, `ADMIN_SESSION_SECRET`은 32바이트 이상 난수 기반 secret을 사용해야 합니다.

### 빌드 및 실행
```bash
npx prisma validate
npm run lint
npm run build
npm run start
```

## MVP 범위 및 제외 사항

### 핵심 원칙
- 본 서비스는 예약 플랫폼이 아닌 **문의 및 연결** 중심의 플랫폼입니다.

### MVP 제외 기능
- 결제 및 정산 시스템
- 실시간 예약 및 객실 재고 관리
- 차량 운송 관련 기능
- 후기(Review) 시스템
- 쿠폰 및 포인트 시스템
- 사용자 회원가입/소셜 로그인
- 외부 API 실제 연동 (지도, AI 등)
- AI 추천·생성 기능의 실제 API 호출

## 보안 메모
- 관리자 세션은 `ADMIN_SESSION_SECRET` 기반 서명 토큰과 만료 시간을 검증합니다.
- 관리자 mutation Server Action은 각 함수 시작부에서 세션을 재검증해야 합니다.
- 문의/입점신청 API는 개인정보 동의와 필수 입력을 서버에서 검증합니다.
- `LeadEvent` 저장 실패는 사용자 CTA 흐름을 막지 않는 best-effort 방식입니다.
- CSP는 현재 MVP에서는 적용하지 않고 Post-MVP 보안 강화 항목으로 둡니다.

## Deployment

- Vercel project: `sowons-projects-e525dae5/localtrip-ax`
- Production URL: `https://localtrip-ax.vercel.app`
- Production env vars registered in Vercel: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`
- Build command: `npm run build` (`prisma generate && next build`)
- Production deployment verified on T-027 with public route smoke tests.

DB schema changes and seed execution are operator-controlled steps. Do not run `prisma db push` or `prisma db seed` against Production without explicit approval.
