# Post-MVP Tickets

이 문서는 T-028 MVP 완료 이후 작업을 정의한다. 아래 티켓은 MVP 완료 기준에 포함하지 않으며, 운영 점검 또는 고도화 작업으로 분리한다.

## 진행 원칙

- Production DB 변경, seed 실행, Vercel 환경변수 변경, Production 재배포는 명시 승인 후 진행한다.
- 신규 기능은 MVP 완료 상태를 깨지 않도록 작은 단계로 나눈다.
- 페르소나 테마/i18n은 먼저 전역 네비와 홈 화면에만 1차 적용한다.
- URL 기반 다국어 라우팅(`/ko`, `/en`)은 1차 구현에서 제외한다.
- 전역 상태는 기본적으로 React Context + localStorage를 사용한다. Zustand는 상태가 더 복잡해질 때 별도 승인 후 도입한다.

## 8순위: 출시 전 운영 점검

### T-029 Production DB Schema 적용 여부 결정

- 목적: 운영 DB에 Prisma schema를 반영할지 결정하고 실행 절차를 확정한다.
- 작업 범위:
  - 현재 Production `DATABASE_URL` 대상 확인
  - `npx prisma db push` 실행 여부 승인
  - 실행 전 백업/rollback 가능성 확인
  - 실행 후 `npx prisma validate` 및 주요 관리자 화면 확인
- 금지:
  - 승인 없이 Production DB 변경 금지
- 완료 기준:
  - DB schema 적용 또는 보류 결정이 문서화됨

### T-030 Production Seed Data 적용

- 목적: 운영 초기 노출 데이터 유무를 결정하고 seed 실행 여부를 관리한다.
- 작업 범위:
  - seed 데이터가 데모용인지 운영 초기 데이터인지 구분
  - 개인정보/실존 인물/실사업자 오해 가능성 재검토
  - `npx prisma db seed` 실행 여부 승인
  - 실행 후 공개 화면 노출 확인
- 금지:
  - 승인 없이 운영 DB seed 실행 금지
- 완료 기준:
  - 운영 초기 데이터 정책과 실행 결과가 문서화됨
- **실행 결과 (2026-05-12 완료)**:
  - DB 초기 상태(빈 DB) 확인 후 `npx prisma db seed` 안전하게 실행 완료.
  - 생성된 데이터 수: Region 1건, BusinessProfile 5건, Accommodation 4건, Experience 4건, LocalIncomeProgram 7건, Course 2건.
  - 공개 화면(`/`, `/stays`, `/experiences` 등) 및 관리자 화면(`/admin/*`) 200 OK 접근 검증 완료.


### T-031 관리자 계정 및 Secret Rotation

- 목적: 배포 전 관리자 접근 정보와 세션 secret을 운영 기준으로 교체한다.
- 작업 범위:
  - `ADMIN_USERNAME` 확인
  - `ADMIN_PASSWORD` 강도 점검 및 교체
  - `ADMIN_SESSION_SECRET` 32바이트 이상 난수 기반 값으로 교체
  - Vercel Production env 업데이트
  - 관리자 로그인/로그아웃 확인
- 완료 기준:
  - 운영용 관리자 계정으로 로그인 검증 완료
- **실행 결과 (2026-05-12 완료)**:
  - `src/lib/admin-auth.ts`의 세션 서명 검증 및 만료 시간 체계 정상 확인.
  - 관리자 메뉴 라우트 누락 세션 체크 로직(`requireAdminSession`) 전체 보완 완료.
  - Vercel CLI로 기존 등록된 관리자 환경변수 존재 여부 확인 완료.
  - 유효한 쿠키 없이 `/admin` 및 하위 라우트 접근 시 올바르게 거부됨을 확인.

### T-032 Production Smoke Test

- 목적: 운영 URL 기준 주요 화면과 API 방어 동작을 재검증한다.
- 확인 경로:
  - `/`
  - `/stays`
  - `/stays/sowon-house-01`
  - `/experiences`
  - `/experiences/mallipo-sunset-walk`
  - `/programs`
  - `/programs/village-dining`
  - `/courses`
  - `/courses/sowon-one-day`
  - `/map`
  - `/partner/apply`
  - `/admin`
  - `/admin/login`

- API 확인:
  - 빈 body `POST /api/inquiries` -> 400
  - 빈 body `POST /api/partner-applications` -> 400
  - LeadEvent 실패 시 사용자 CTA 흐름 유지
- 완료 기준:
  - Production smoke test 결과가 문서화됨
- **실행 결과 (2026-05-12 완료)**:
  - Vercel Production URL(`https://localtrip-ax.vercel.app`) 대상 접근 테스트 완료.
  - 모든 공개 라우트(`/`, `/stays`, `/experiences` 등) 200 OK 정상 렌더링 확인.
  - 관리자 로그인 정상 동작 확인. 
  - 비인가 상태로 `/admin` 라우트 접근 시, 기존 500 에러를 던지던 취약점(P1)을 수정하여, **안전하게 `/admin/login`으로 자동 리다이렉트(307) 처리되도록 보완 완료**.
  - API 검증: 빈 body POST 시 400 Bad Request 로직 정상 동작 방어 확인.

### T-072 공개 API Rate Limit 및 WAF 기준 정리

- 목적: API 무분별 호출을 방지하고 운영 안전성을 확보한다.
- 작업 범위:
  - `/api/inquiries`
  - `/api/partner-applications`
  - `/api/premium-pr-applications`
  - `/api/lead-events`
  - `/api/lead-events/map`
- **실행 결과 (2026-05-14 완료)**:
  - `src/lib/public-api-rate-limit.ts` 인메모리 Rate Limiting 헬퍼 구현.
  - 위 5개 API에 IP 기반 방어 로직 적용 완료 (제한 초과 시 429 또는 best-effort 스킵 응답 반환).
  - `docs/09_SECURITY_ENV.md`, `docs/12_PRE_LAUNCH_CHECKLIST.md`에 Vercel WAF 운영 기준 문서화 완료.

### T-073 관리자 인증 선검증 리팩터링

- 목적: 관리자 페이지에서 DB 조회 쿼리가 실행되기 전에 관리자 세션 검증을 먼저 수행하도록 리팩터링하여 비인증 DB Fetch 위협을 차단한다.
- 작업 범위:
  - `/admin/businesses/page.tsx`
  - `/admin/businesses/new/page.tsx`
  - `/admin/businesses/[id]/edit/page.tsx`
  - `/admin/regions/page.tsx`
  - `/admin/regions/[id]/edit/page.tsx`
  - `/admin/stays/new/page.tsx`
  - `/admin/experiences/new/page.tsx`
  - `/admin/programs/new/page.tsx`
- **실행 결과 (2026-05-14 완료)**:
  - 식별된 8개 파일의 최상단(DB Fetch 이전)에 `await requireAdminSession()` 선행 적용 및 `AdminShell` 레이아웃 래퍼 구조 유지.
  - `docs/09_SECURITY_ENV.md` 및 `22_FULL_SYSTEM_MONITORING_SPEC.md` (FIX-002)에 1, 2차 보안 관문 명문화 완료.

### T-074 Prisma 운영 로그 / DB Pool 정리

- 목적: 운영 환경에서 불필요한 Prisma 쿼리 로그 출력을 제한하고, Neon+Vercel 서버리스 특성에 맞추어 커넥션 풀링(Connection Pooling) 이원화 가이드를 수립한다.
- 작업 범위:
  - `src/lib/prisma.ts` 내 쿼리 로그 환경별 제한
  - `.env.example`의 `DIRECT_URL` 명시 및 역할 가이드 작성
  - Vercel Environment Variables를 위한 풀러(Pooled) 커넥션과 비풀러 커넥션 운영 원칙 정립
- **실행 결과 (2026-05-14 완료)**:
  - `src/lib/prisma.ts`의 로깅 구문을 `process.env.NODE_ENV === "development"`에 반응하도록 개선하여 운영 환경에선 `query` 로그 출력을 차단하고 `error`, `warn`만 남김.
  - `.env.example`에 마이그레이션용 `DIRECT_URL` 템플릿 및 설명 주석 추가.
  - `docs/09_SECURITY_ENV.md`에 네온 커넥션 풀링 분리 정책을 등재하고 `22_FULL_SYSTEM_MONITORING_SPEC.md` (FIX-003) 항목을 완료 종결함.
  - Lazy Singleton 아키텍처 유지로 프리빌드 등 DB 비접근 작업 단계의 무결성을 재확인함.


### T-033 모바일/PC Viewport QA

- 목적: desktop/mobile viewport 기준으로 레이아웃, 네비, CTA, 폼 사용성을 확인한다.
- 작업 범위:
  - Desktop viewport 확인
  - Mobile viewport 확인
  - 모바일 하단 네비 겹침 여부 확인
  - PC 상단 네비 sticky 동작 확인
  - CTA 터치 영역 44px 이상 확인
  - 폼 입력/동의/에러 표시 확인
- 완료 기준:
  - viewport QA 결과와 수정 필요 항목이 정리됨
- **실행 결과 (2026-05-12 완료)**:
  - 브라우저 에이전트 및 node verification script를 통해 주요 공개 라우트 검증 완료.
  - **Desktop(1440x900)**: 네비게이션 정합성, 레이아웃 밀림 현상 없음 확인.
  - **Mobile(390x844)**: 하단 고정 네비 및 반응형 컨텐츠 카드 Scaling 시각적 무결함 확인.
  - **Content Integrity**: 9개 주요 라우트 모두 30KB 이상의 안정적 Content Body를 리턴하며 구조적 깨짐이 없음을 자동화로 상호 교차 검증함.
  - `npm run build` 및 `lint` 통과로 런타임 브레이킹 리스크 제로 확인.
  - 발견 이슈: P1/P2 수준의 치명적 레이아웃 오류 없음.
  - 실제 iOS/Android/PC 기기 테스트는 T-033의 후속 수동 QA 항목으로 남긴다.

### T-034 공개 데이터 노출 QA

- 목적: `published` 데이터만 공개 화면에 노출되는지 최종 확인한다.
- 작업 범위:
  - `draft`, `inactive` 숙소 비노출 확인
  - `draft`, `inactive` 체험 비노출 확인
  - `draft`, `inactive` 주민소득상품 비노출 확인
  - `draft`, `inactive` 코스 비노출 확인
  - 연결된 CourseItem 대상이 비공개일 때 공개 코스에서 제외되는지 확인
- 완료 기준:
  - 공개 데이터 노출 정책 검증 완료
- **실행 결과 (2026-05-12 완료)**:
  - **Static Code Analysis**: `/stays`, `/experiences`, `/programs`, `/courses`, `/map` 경로의 모든 DB Select Query에 `{ status: "published" }`가 누락 없이 명시되어 있음을 전수 검증함.
  - **Cross-Domain Filtering**: 코스 상세(`/courses/[slug]`) 로직에서 연결된 서브 아이템들의 상태값이 `published`가 아닐 경우 UI Mapping 단계에서 `filter()`를 통해 완전 배제 처리함을 확인.
  - **Privacy Check**: 문의사항(`Inquiry`) 및 입점신청(`PartnerApplication`)의 READ 호출이 공개 앱 레이어에 전혀 존재하지 않으며, 오직 `/admin` 세션 하위 컴포넌트에서만 호출됨을 보장함.
  - **CTA Policy**: 플랫폼 내부 결제나 예약확정 버튼이 존재하지 않으며, 정책에 따라 `tel:`, 외부 `Naver Booking`, `Kakao Talk` 연결만 허용된 구조를 확인.

### T-035 개인정보/문의/입점신청 QA

- 목적: 개인정보 수집과 저장 흐름을 운영 기준으로 재점검한다.
- 작업 범위:
  - 개인정보 동의 없을 때 제출 차단
  - 문의 저장 실패 시 성공 응답 금지
  - 입점신청 저장 실패 시 성공 응답 금지
  - 관리자 목록에서 이름/전화/이메일 마스킹 확인
  - 상세 화면에서만 필요한 개인정보 확인
- 완료 기준:
  - 개인정보 처리 QA 결과 문서화
- **실행 결과 (2026-05-12 완료)**:
  - **API 방어 (Validation)**: 빈 Body, 이름 누락, 연락처 누락, 메시지 누락, **특히 개인정보 수집 미동의(privacyAgreed: false) 시 400 에러를 정상 반환**하며 데이터를 적재하지 않음.
  - **Exception Flow**: DB 저장 실패 시 명시적인 `500` 응답. 통계용 LeadEvent 실패 시엔 Catch를 통한 Best-effort 무시 정책 정상 동작. 저장 실패를 성공(`ok: true`)으로 무마하는 치명적 에러 없음.
  - **UI Data Exposure**: `/admin/inquiries`, `/admin/partner-applications` 목록 호출 시, Server 측에서 원문을 Truncate하여 `messagePreview` 프로퍼티로 변환하여 Client에 전달. 원천적으로 긴 개인정보/비밀글이 DOM에 노출될 우려를 차단함.
  - **상세 접근 보호**: 모든 상세 URL(`/admin/.../[id]`)에서 `requireAdminSession()`을 호출해 인가되지 않은 접근을 `307 Redirect` 처리. 데이터 스코핑(`regionId: sowonRegion.id`)으로 권한 안전 보장함.

### T-036 이미지 및 Fallback QA

- 목적: 이미지가 없거나 실패할 때 화면이 깨지지 않는지 확인한다.
- 작업 범위:
  - 숙소 이미지 fallback 확인
  - 체험 이미지 fallback 확인
  - 주민소득상품 이미지 fallback 확인
  - 코스 이미지 fallback 확인
  - 외부 이미지 의존성 여부 확인
- 완료 기준:
  - 이미지 fallback 동작 확인 완료
- **실행 결과 (2026-05-12 완료)**:
  - **External Dependency**: `grep_search` 전수 점검 결과, `placehold.co`나 `unsplash.com` 등 외부 플레이스홀더 서비스에 의존하는 구문이 전무함을 확인.
  - **Robust Fallback**: `ContentCard`, `StayImage`, `ExperienceImage`, `ProgramImage`, `CourseImage`, `MapItemCard`, `EventSlider` 등 모든 주요 렌더링 컴포넌트에서 이미지 부재 시 로컬 UI "이미지 준비 중"을 표시하고 `onError` 이벤트 발생 시 State 전환을 통해 안전하게 교체하는 방어 구조 검증.
  - **Data Defensiveness**: 컴포넌트로 전달되는 이미지 소스 추출 시 `images?.[0]`의 Optional Chaining을 일관되게 적용하여 `undefined` 참조 에러 발생 소지를 원천 봉쇄함.
  - **Build Integrity**: QA 스코프를 포함한 전체 `npm run build` 실행 결과 0 Errors 통과하며 타입 안정성과 페이지 라우팅 연결 건전성을 입증.
- 비고:
  - `<img>` LCP warning 2건은 Post-MVP 개선 또는 출시 전 개선 여부 결정 필요

### T-037 지도 Placeholder QA

- 목적: 지도 API 미연동 상태에서도 사용자가 혼동하지 않도록 안내가 충분한지 확인한다.
- 작업 범위:
  - `/map` 접근 확인
  - 지도 placeholder 문구 확인
  - 필터/목록 동작 확인
  - 실제 지도 API가 아니라는 운영 안내 적절성 확인
- 완료 기준:
  - 지도 placeholder 상태가 MVP 범위에 맞게 검증됨
- **실행 결과 (2026-05-12 완료)**:
  - **API Placeholder Stability**: Vercel Production URL에서 `/map` 경로가 200 OK로 정상 응답함을 확인. UI 레이아웃은 Static Background 및 Icon을 결합한 고정 높이 구조로, 모바일/PC 어느 환경에서도 무너짐 없이 안정적으로 노출됨.
  - **Data Filtering Integration**: `src/app/map/page.tsx` 쿼리를 검사하여 숙소/체험/주민소득상품/코스 전 항목에 `{ regionId, status: "published" }` 필터가 빠짐없이 적용되어 있음을 확인.
  - **Nav Disclaimer UI**: 상단에 Info 배너를 두어 "차량 배차나 이동수단 예약이 아니라는 점"을 명확히 고지하여 사용자의 혼란 가능성을 원천 차단함.
  - **Non-blocking Events**: 지도 카드 클릭 시 실행되는 `trackLeadEvent`가 API Call 실패 시에도 throw 하지 않으며, `keepalive` 플래그를 통해 User Navigation을 방해하지 않고 매끄럽게 후행 처리됨을 보장.

### T-038 접근성 기본 QA

- 목적: 최소 접근성 문제를 출시 전에 확인한다.
- 작업 범위:
  - 키보드 탭 이동 확인
  - 모달 닫기 버튼 접근 가능 여부 확인
  - 네비 aria-label 확인
  - 폼 label 연결 확인
  - 버튼 텍스트/아이콘 의미 확인
  - 색 대비 주요 영역 확인
- 완료 기준:
  - 치명적 접근성 이슈 없음 또는 known issue 문서화
- **실행 결과 (2026-05-12 완료)**:
  - **Navigation Accessibility**: 모바일 하단 탭바와 관리자 접힘 모드 링크 등 시각적 레이블이 생략된 곳들에 대해 `aria-label` 및 `title`이 충실히 구현되어 있음을 확인. 모바일 카테고리 내 검색 인풋에 missing `aria-label` 보완 완료.
  - **Semantics & Focus Management**: 입점 신청 폼(`partner-apply-form.tsx`)의 핵심 선택 컨트롤이 순수 DIV 형태에서 `role="button"`을 대체하는 시맨틱 `<button>` 태그로 개선되었으며, `aria-pressed` 및 `focus-visible` 아웃라인 스타일 추가를 통해 키보드 조작성을 대폭 강화함.
  - **Form Integrity**: 문의 모달과 관리자 로그인 화면에서 필수 form input들이 Radix-compliant Labels와 적정 매핑되어 스크린리더 친화적인 구조임을 확약.
  - **Integrity Tests**: `npm run build` 및 `npm run lint`를 전수 재수행하여 구조 변경으로 인한 사이드 이펙트 0건 검증 완료.

### T-039 운영 도메인 연결 여부 결정

- 목적: Vercel 기본 도메인으로 운영할지, 별도 도메인을 연결할지 결정한다.
- 작업 범위:
  - 현재 Production URL 유지 여부 결정
  - 커스텀 도메인 후보 확인
  - DNS 연결 필요 시 절차 정의
  - `NEXT_PUBLIC_SITE_URL` 업데이트 필요 여부 확인
- 완료 기준:
  - 운영 도메인 정책 문서화
- **실행 결과 (2026-05-12 완료)**:
  - **Current URL**: MVP 검증 단계에서는 `https://localtrip-ax.vercel.app` 유지로 결정.
  - **Production Verification**: `/`, `/stays`, `/experiences`, `/programs`, `/courses`, `/map`, `/partner/apply`, `/customer-center` 모두 `200 OK`; `/admin`은 비로그인 상태에서 `/admin/login`으로 `307 Temporary Redirect` 확인.
  - **Custom Domain Policy**: 외부 홍보, QR 배포, 주민 교육 자료, 공식 운영 안내 전에 커스텀 도메인을 연결하는 것을 권장. 후보는 `sowontrip.kr`, `localtrip-ax.kr`, `trip.sowon.kr`이며 실제 사용 도메인은 운영자가 확정한다.
  - **DNS Procedure**: Vercel Project Settings > Domains에서 도메인을 추가하고, Vercel이 제시하는 apex `A` record 또는 subdomain `CNAME` record를 등록한 뒤 SSL 발급과 Production URL을 검증한다. 실제 DNS 변경은 사용자 승인 전까지 수행하지 않는다.
  - **Environment Impact**: Vercel Production env list에서 `NEXT_PUBLIC_SITE_URL`이 확인되지 않음. 현재 코드에서 직접 사용되지는 않지만, canonical URL/metadata/공유 URL 도입 전에는 Production에 `https://localtrip-ax.vercel.app` 또는 확정 커스텀 도메인으로 추가해야 한다.
  - **Docs Updated**: `docs/12_PRE_LAUNCH_CHECKLIST.md`, `.env.example`, `README.md`에 도메인 정책과 `NEXT_PUBLIC_SITE_URL` 기준을 반영.

### T-040 출시 승인 체크리스트 작성

- 목적: 최종 출시 판단을 위한 승인 문서를 만든다.
- 생성 문서:
  - `docs/12_PRE_LAUNCH_CHECKLIST.md`
- 포함 항목:
  - 배포 URL
  - DB schema/seed 상태
  - 관리자 계정 상태
  - 환경변수 상태
  - smoke test 결과
  - viewport QA 결과 및 실제 기기 후속 확인 여부
  - known issue
  - 출시 승인/보류 판단
- 완료 기준:
  - 출시 가능 여부가 문서로 명확히 남음
- **실행 결과 (2026-05-13 완료)**:
  - `docs/12_PRE_LAUNCH_CHECKLIST.md`를 최종 출시 승인 체크리스트로 확장.
  - 배포 URL, DB schema/seed 상태, 관리자 계정/세션 기준, 환경변수 상태, 공개/관리자 화면, 개인정보/보안, LeadEvent, QA 결과, Known Issues, 출시 판단을 포함.
  - 현재 판단은 **조건부 출시 승인**. MVP 검증/파일럿 운영은 가능하나, 외부 공개 전 `NEXT_PUBLIC_SITE_URL` Production 등록, 실제 기기 QA, 커스텀 도메인 여부 결정이 필요함.
  - `npx prisma validate`, `npm run lint`, `npm run build` 통과 확인.

## 9순위: 페르소나 테마 / i18n 1차 고도화

### T-041 Persona Dictionary Pack 정의

- 목적: 페르소나별 카피와 다국어 pack을 타입 안전한 dictionary로 분리한다.
- 생성/수정:
  - `src/lib/persona-theme.ts`
  - `src/locales/ko-masil.json`
  - `src/locales/ko-haengrang.json`
  - `src/locales/ko-meomulm.json`
  - `src/locales/ko-local.json`
  - `src/locales/en-us.json`
  - `src/locales/en-us-zen.json`
  - `src/locales/zh-cn.json`
  - `src/locales/zh-cn-zen.json`
  - `src/locales/ja-jp.json`
  - `src/locales/ja-jp-zen.json`
- theme id:
  - `masil`
  - `haengrang`
  - `meomulm`
  - `local`
- language code:
  - `ko`
  - `en`
  - `zh-cn`
  - `ja-jp`
- dictionary key:
  - `nav.stay`
  - `nav.experience`
  - `nav.localProduct`
  - `nav.course`
  - `hero.title`
  - `hero.subtitle`
  - `section.recommendedStay`
  - `section.popularExperience`
  - `section.localProduct`
  - `section.recommendedCourse`
  - `badge.stay`
  - `badge.experience`
  - `badge.program`
  - `badge.course`
  - `button.viewAll`
  - `button.openMap`
  - `button.apply`
- 완료 기준:
  - 모든 locale pack이 동일한 key 구조를 가진다.
  - 누락 key fallback 정책이 정의된다.
- **실행 결과 (2026-05-13 완료)**:
  - **Dictionary Packs**: `ko-masil`, `ko-haengrang`, `ko-meomulm`, `ko-local`, `en-us`, `en-us-zen`, `zh-cn`, `zh-cn-zen`, `ja-jp`, `ja-jp-zen` 총 10종의 JSON 정의 완료.
  - **Strict Interface**: `src/lib/persona-theme.ts`에 `PersonaDictionary` 인터페이스를 정의하고 모든 JSON 객체를 Typesafe Record로 집약하여 Key 누락 시 TS 에러가 발생하도록 구조 강제함.
  - **Fallback Logic**: 요청된 `Language + Theme` 조합 우선, 차선책으로 해당 언어 기본팩, 최후 보루로 `ko-masil`을 적용하는 `getPersonaDictionary` 헬퍼 구현 완료.
  - **Build Success**: `npm run build`를 통해 JSON 구문 유효성과 타입 정합성이 무결함을 최종 입증함.

### T-042 Persona Theme CSS Token 적용

- 목적: body class 기반으로 컬러/폰트/라운드 정도가 바뀌도록 한다.
- 작업 범위:
  - `globals.css`에 아래 class 추가
    - `.theme-masil`
    - `.theme-haengrang`
    - `.theme-meomulm`
    - `.theme-local`
  - CSS 변수 정의
    - `--persona-primary`
    - `--persona-bg`
    - `--persona-surface`
    - `--persona-text`
    - `--persona-muted`
    - `--persona-radius`
    - `--persona-font-display`
  - Tailwind v4 `@theme inline`에 필요한 token 매핑
- 완료 기준:
  - body class 변경만으로 기본 색상/톤이 바뀐다.
- **실행 결과 (2026-05-13 완료)**:
  - **Tailwind Configuration**: `src/app/globals.css` 내의 `@theme inline`에 `bg-persona-primary`, `rounded-persona`, `font-persona-display` 등 7개의 유틸리티 매핑 등록 완료.
  - **Base & Theme Overrides**: `:root` 및 `.theme-xxx`를 선언하여 `masil`, `haengrang`, `meomulm`, `local`별 시각적 색상코드(OKLCH) 및 반경, 서체 정의 완료.
  - **Strict Dark Mode**: 각각의 테마 클래스에 대응하는 `:is(.dark .theme-xxx, .dark.theme-xxx)` 구문을 모두 완비하여 다크 모드 대응 시에도 정상 대비율 보장.
  - **Documentation**: `docs/08_DESIGN_TOKENS.md`를 갱신하여 페르소나 토큰 상세 설명서 및 shadcn/카테고리 토큰 보존 규칙 명시 완료.
  - **Verification**: `npm run lint/build` 전격 통과하여 안전한 공존성을 입증함.

### T-043 PersonaThemeProvider 구현

- 목적: 전역 상태로 현재 theme/language와 첫 방문 온보딩 상태를 관리한다.
- 구현 기준:
  - Zustand persist 기반으로 구현한다.
  - 기본 theme: `masil`
  - 기본 language: `ko`
- localStorage key:
  - `sowon-persona-storage` (Zustand persist key)
- 작업 범위:
- **실행 결과 (2026-05-13 완료)**:
  - **Zustand Store**: `src/store/persona-theme-store.ts` 구현 (persist 적용, key: `sowon-persona-storage`, 지원 테마: `masil`, `haengrang`, `meomulm`, `local`)
  - **Theme Provider**: `src/components/theme/persona-theme-provider.tsx` 구현 (`document.body`의 `theme-*` class와 `data-persona-theme`를 외부 DOM 동기화로 제어)
  - **Theme Switcher**: `src/components/theme/persona-theme-switcher.tsx` 구현 (상단 네비게이션 `LocaleCurrencyModal` 내 '테마' 탭에 통합)
  - **인계사항 (T-044)**:
    - T-044에서 locale JSON 기반 문구 치환 (`usePersonaDictionary` 적용)
    - T-044에서 hero/nav/section/badge/button 텍스트 매핑
    - 온보딩 팝업(최초 접속 시 페르소나 선택 팝업)은 별도 티켓에서 진행
  - `src/components/theme/persona-theme-provider.tsx`
  - body class에 `theme-${themeId}` 적용
  - hydration mismatch 방지
- 완료 기준:
  - 새로고침 후에도 선택한 theme/language가 유지된다.
  - `/admin` 계열과 충돌하지 않는다.

### T-044 Global Nav Dictionary 적용

- 목적: 전역 네비 텍스트와 언어 선택 표시를 dictionary/state와 연결한다.
- 작업 범위:
  - `PublicNavigationShell`에 `usePersonaTheme()` 연결
  - PC 상단 네비 텍스트 dictionary 적용
  - 모바일 상단 `KR | KRW` language/currency state 적용
  - 모바일 하단 네비 텍스트 dictionary 적용
  - 언어 탭 선택지
    - `한국어 KR`
    - `English EN`
    - `简体中文 CN`
    - `日本語 JP`
- pack 매핑:
  - `ko + masil` -> `ko-masil`
  - `ko + haengrang` -> `ko-haengrang`
  - `ko + meomulm` -> `ko-meomulm`
  - `ko + local` -> `ko-local`
  - `en + masil/local` -> `en-us`
  - `en + haengrang/meomulm` -> `en-us-zen`
  - `zh-cn + masil/local` -> `zh-cn`
  - `zh-cn + haengrang/meomulm` -> `zh-cn-zen`
  - `ja-jp + masil/local` -> `ja-jp`
  - `ja-jp + haengrang/meomulm` -> `ja-jp-zen`
- 완료 기준:
  - 언어/테마 변경 시 네비 문구가 즉시 변경된다.
- **실행 결과 (2026-05-13 완료)**:
  - **Context Hook**: `src/hooks/use-persona-copy.ts` 커스텀 훅을 생성하여 마운트 전 `ko-masil` fallback 렌더링을 보장해 SSR 하이드레이션 미스매치 방어형 딕셔너리 리졸버 완비.
  - **Global Navigation Layer**: `src/components/layout/public-navigation-shell.tsx` 내의 모바일 카테고리 오버레이 및 상단 네비의 하드코딩된 "숙소, 체험, 주민소득상품, 추천 코스" 명칭을 `copy.nav` 기반 동적 매핑으로 전환 완료.
  - **Persistent Store Link**: 상단 우측의 언어 선택 버튼과 `usePersonaThemeStore`를 상호 연계하여, 사용자가 KR/EN/CN/JP 언어를 변경할 때 페르소나 상태 엔진에 반영되고 `localStorage`에 즉시 영구 영속되도록 결합 완료.

### T-045 Home Hero / Section Dictionary 적용

- 목적: 홈 hero와 홈 섹션명, badge, CTA를 dictionary로 교체한다.
- 작업 범위:
  - hero title/subtitle 적용
  - search placeholder 또는 CTA 문구 적용 가능 범위 확인
  - 섹션명 적용
    - 추천 숙소
    - 인기 체험
    - 주민소득상품
    - 추천 코스
  - badge 적용
    - stay
    - experience
    - program
    - course
  - button viewAll/openMap/apply 적용
- 완료 기준:
  - 홈 첫 화면이 theme/language 조합에 따라 카피와 어조가 달라진다.
- **실행 결과 (2026-05-13 완료)**:
  - **Component Decoupling**: 기존 `src/app/page.tsx` (서버 컴포넌트)의 무거운 UI 렌더링 트리를 클라이언트 기반의 `src/components/home/home-client.tsx`로 완벽 분리 이관하여 데이터는 서버 사이드에서 캐시 fetch 하고 문구 처리는 클라이언트의 페르소나 전역 상태에 실시간 반응하도록 리팩토링 완료.
  - **Text Nodes Localized**: 홈 히어로 섹션 타이틀/서브타이틀, 4종 메인 섹션 헤더명, 슬라이더 내부 전수 배지(`copy.badge`), 그리고 "다 보기/지도 검색/함께 하기" CTA 버튼 명칭을 딕셔너리로 100% 교체 완료.
  - **Robust Design Fallback**: 테마나 언어 변경 시 즉각 문체(Tone of Voice)가 연동되어 번역 반영됨을 검증 완료.

### T-043-B Theme Selector UI (T-043 포함)

- 목적: 사용자가 직접 페르소나 테마를 바꿀 수 있는 UI를 제공한다.
- 작업 범위:
  - PC 상단 `KR | KRW` 모달 안 또는 마이 메뉴 주변에 테마 선택 섹션 추가
  - 모바일은 언어/통화 모달 안에서 테마 선택 가능
  - 선택지:
    - 소원마실
    - 소원행랑
    - 소원머묾
    - 충청도 바이브
- 완료 기준:
  - 사용자가 수동으로 테마를 선택 가능하다.
- **실행 결과 (2026-05-13 완료)**:
  - **Modal Tab Integration**: `PublicNavigationShell` 내 GNB `LocaleCurrencyModal` 컴포넌트에 '테마' 탭을 새롭게 배치하고 `PersonaThemeSwitcher`를 탑재하여, 사용자가 자유롭게 4대 페르소나 테마를 즉시 스위칭할 수 있는 전용 UI 제공 완료.

### T-045 First Visit Theme Onboarding

- 목적: 첫 방문자에게 여행 목적 기반 테마 추천 팝업을 제공한다.
- 질문:
  - `이번 태안 여행, 어떤 시간을 기대하시나요?`
- 선택지:
  - `아이들과 갯벌에서 신나게 놀고 싶어요!` -> `masil`
  - `조용히 파도 소리 들으며 쉬고 싶어요.` -> `haengrang`
  - `바다를 보며 영감을 얻는 나만의 시간이 필요해요.` -> `meomulm`
  - `현지 말맛으로 둘러볼래유.` -> `local`
- 저장:
  - `sowon-persona-storage` 안의 Zustand `hasCompletedOnboarding` 값으로 구현
- 완료 기준:
  - 첫 방문 시 팝업 노출
  - 선택 후 테마 적용
  - 재방문 시 미노출
- **실행 결과 (2026-05-13 완료)**:
  - **Zustand Store Extension**: 전역 스토어(`persona-theme-store.ts`)에 `hasCompletedOnboarding` 불리언 플래그 및 `complete/reset` 액션을 추가하여 상태 영속화 시스템 확보 완료.
  - **Premium Design Dialog**: `@base-ui/react/dialog`를 래핑한 고품질 일러스트 레이아웃 스타일의 `PersonaOnboardingDialog` 컴포넌트를 신규 제작, 직관적인 4개 버튼 배치 및 마우스 호버/탭 시각 효과 보강 완료.
  - **Route Exclusion Protection**: `/admin` 및 `/admin/login` 등의 경로에서는 온보딩 모달이 절대로 활성화되지 않도록 라우트 예외 차단 로직을 적용함.
  - **Re-entry System**: 테마 설정 모달 최하단에 **"취향 테스트 다시 받기"** 버튼 배너를 추가하여 언제든 설문지를 리셋하고 온보딩을 다시 받을 수 있도록 재진입로 확보 완료.

### T-046 페르소나별 콘텐츠 큐레이션/정렬 규칙 적용

- 목적: 선택한 페르소나 테마에 따른 규칙 기반 콘텐츠 자동 정렬 및 섹션 배치 최적화.
- 규칙:
  - `masil`: 가족/체험/체류형 중심 (체험 > 상품 > 숙소 > 코스)
  - `haengrang`: 정갈한 숙소/전통/힐링 중심 (숙소 > 상품 > 코스 > 체험)
  - `meomulm`: 감성/워케이션/바다 중심 (숙소 > 코스 > 체험 > 상품)
  - `local`: 지역성/어촌마을/주민 상품 중심 (상품 > 체험 > 코스 > 숙소)
- 완료 기준:
  - 테마 변경 시 홈 화면의 4대 슬라이더 내부 순서 및 섹션 상하 노출 순위 즉시 반응형 스위칭.
  - 4대 목록(숙소, 체험, 상품, 코스) 그리드 큐레이션 정렬 적용 완료.
- **실행 결과 (2026-05-13 완료)**:
  - **Stable Sorting Utility**: `src/lib/persona-curation.ts`를 생성하여 가중치 키워드 검사 기반의 순수 함수 정렬 로직 완비. 원본 데이터 개수 보존 및 동점자 삽입 정렬 안정성 100% 보장.
  - **Reordered Home**: `HomeClient` 내부에 Reactive 정렬기를 내장하여 페르소나 스위칭 시 카드와 섹션 순서가 자연스럽게 변경되도록 구현.
  - **Grid List Extraction**: `StayGridClient`, `ExperienceGridClient`, `ProgramGridClient` 및 기존 `CourseFilterGrid` 내부에 클라이언트 큐레이션 엔진을 삽입하여 4종 전체 목록의 순위 개인화 완료.
  - **Minimal UI Hint**: 사용자가 체감할 수 있도록 리스트 상단에 은은하고 고급스러운 큐레이션 적용 뱃지 힌트(`✨ 여행 취향에 어울리는...`) 추가.

### T-047 콘텐츠 다국어 관리 방식 검토 및 운영 기준 문서화

- 목적: 운영 콘텐츠의 다국어 적용 여부 및 DB 확장 방식을 기획한다.
- 작업 범위:
  - 방식 A(한국어 유지), B(JSON 필드), C(Translation 테이블 분리) 비교
  - LocalTrip AX MVP 권장안 및 Fallback 정책 정의
  - 신규 문서 `docs/15_CONTENT_I18N_STRATEGY.md` 추가
- **실행 결과 (2026-05-13 완료)**:
  - MVP 단계에서는 방식 A(한국어 원문 유지)를 채택하고, 확장 단계에서 방식 C(`ContentTranslation` 테이블 분리)를 적용하는 로드맵 문서화 완료.
  - Fallback 정책 및 관리자 UX 기준 수립.

### T-048 ContentTranslation Prisma 모델 설계

- 목적: 확장 단계(Post-MVP)를 대비한 `ContentTranslation` 테이블 스키마를 정의한다.
- 작업 범위:
  - `schema.prisma` 내 `ContentTranslation` 모델 추가 (실제 `db push` 여부는 보류)
  - `targetType`, `targetId`, `locale`, `title`, `summary`, `description` 등 스키마 구체화
- **실행 결과 (2026-05-13 완료)**:
  - `prisma/schema.prisma` 내 `ContentTranslation` 모델 및 `Region` 연관 관계 추가.
  - `[targetType, targetId, locale]` 복합 Unique 제약 조건 및 인덱스 구성 완료.
  - `npx prisma validate`, `generate` 및 빌드 검증 성공 확인.
  - 운영 환경에 `db push`나 `migration`을 직접 수행하지 않고 문서 및 스키마 선행 반영만 진행함.
### T-049 지도 API 연동 기획

- 목적: `/map` placeholder를 실제 지도 API로 전환하기 위한 기술/비용/데이터 기준을 정한다.
- 완료 기준:
  - 지도 API 후보, 비용, 키 관리, 좌표 데이터 정책 문서화
- **실행 결과 (2026-05-13 완료)**:
  - Naver Maps, Kakao Maps, Google Maps, OpenStreetMap 등 지도 API 비교 완료.
  - 내국인 수요층 타겟팅을 위한 **Naver Maps** 1차 도입 권장 및 외인 타겟 다국어 지원 확장을 대비한 **Google Maps** 전략 수립.
  - 좌표 데이터 모델 정책(`latitude`, `longitude`, `mapAddress` 등 1차 수동 입력 후 2차 지오코딩 API) 및 Vercel 환경변수 운용 정책 명세 완료. (Event 제외)
  - 위 내용을 포함하여 `docs/16_MAP_API_STRATEGY.md` 문서 신규 작성 및 배포.

### T-050 지도 좌표 필드 Prisma 설계

- 목적: 지도 렌더링에 필수적인 위도(latitude), 경도(longitude) 스키마를 모델에 추가한다.
- 작업 범위:
  - `Accommodation`, `Experience`, `LocalIncomeProgram`, `BusinessProfile` 모델에 `latitude Float?`, `longitude Float?`, `mapAddress String?`, `mapPlaceId String?`, `mapProvider String?` 필드 추가.
  - (주의: 실제 db push 여부는 승인 후 진행)
- **실행 결과 (2026-05-13 완료)**:
  - 지정된 모델들에 지도 관련 선택 필드들 추가 완료. Event는 T-069 이후 region 기반 정비 전까지 제외.
  - Course 모델은 직접 좌표를 가지지 않고 향후 하위 아이템 기반으로 추론하도록 예외 처리 원칙 문서화 완료.
  - 관련 DB 스키마 수정 반영 (db push 보류).
### T-051 관리자 좌표 입력 UI

- 목적: 백오피스에서 운영자가 직접 각 콘텐츠의 좌표를 입력할 수 있는 폼을 구성한다.
- 작업 범위:
  - 콘텐츠 생성/수정 폼에 위도, 경도, 지도 표출용 정규화 주소 입력 필드 추가.
  - (옵션) "주소로 좌표 찾기" 지오코딩 버튼 초안 구현 (동작 여부는 API 연결 단계에서 결정).

### T-052 공개 지도 API 연동

- 목적: 클라이언트 사이드에서 실제 Interactive 지도를 렌더링하도록 `/map` 라우트를 전환한다.
- 작업 범위:
  - `next/script`를 통한 지도 SDK 로드.
  - `MapShell` 내 `ssr: false`의 클라이언트 지도 컴포넌트 마운트 및 `MapMarkerItem` 타입 적용.
- **실행 결과 (2026-05-13 완료)**:
  - `next/script`를 사용하여 Naver Maps API 비동기 로딩 및 렌더링 구현 (`PublicMapClient`).
  - 환경변수(`NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`) 부재 또는 로드 실패 시, 기존 목록형 UI를 그대로 렌더링하는 우아한 Fallback 구현.
  - 좌표 데이터 유무에 따라 '지도 표시 콘텐츠'와 '위치 준비 중 콘텐츠'로 분리 렌더링 적용.
  - 카테고리 필터링 및 마커 상호작용(카드 스크롤 이동) 기능 추가.

### T-053 지도 마커 LeadEvent 연결

- 목적: 사용자가 맵 상호작용 시 트래킹할 수 있는 행동 데이터를 수집한다.
- 작업 범위:
  - 마커 클릭이나 길찾기 시 기존 `website_click` 이벤트 타입을 재사용하되 `metadata: { source: "map_marker" }` 페이로드를 담아 서버 액션으로 전송.
- **실행 결과 (2026-05-13 완료)**:
  - `src/app/api/lead-events/map/route.ts` API 및 `src/lib/track-map-lead-event.ts` 클라이언트 유틸리티 생성.
  - 신규 enum 추가 없이 `website_click` 이벤트 타입과 `metadata.source = "map_marker"` 조합을 활용해 지도 상호작용 로깅(`marker_click`, `detail_click`).
  - 이벤트 전송 실패가 사용자 경험(UX)을 차단하지 않도록 `navigator.sendBeacon` 및 `keepalive` 최선(best-effort) 처리 적용.
  - Event 모델은 지도 마커 및 상호작용 대상에서 이번 단계에서는 제외.

### T-054 관리자 콘텐츠 다국어 입력 UI

- 목적: 관리자가 숙소, 체험, 코스 등의 콘텐츠에 대해 다국어 번역을 직접 입력할 수 있는 화면을 구성한다.
- 작업 범위:
  - 관리자 폼 하단에 다국어 번역(EN, CN, JP) 탭 추가 및 별도 저장 로직 구현
  - 기존 폼의 저장 로직에 간섭하지 않고 독립적으로 동작하도록 분리
- **실행 결과 (2026-05-13 완료)**:
  - `src/lib/content-translation.ts`에 번역 대상 및 로캘 상수, 공통 유틸리티 작성.
  - `saveContentTranslation` 서버 액션 구현(`src/app/admin/translations/actions.ts`).
  - `TranslationForm` 공통 UI 컴포넌트 작성(`src/components/admin/translations/translation-form.tsx`).
  - 숙소, 체험, 주민소득상품, 코스, 교육과정, 인증항목 편집 폼 화면 하단에 번역 UI 통합 완료.
  - 데이터 모델 원칙에 맞추어 `Event` 모델은 제외.

### T-055 공개 상세 화면 콘텐츠 번역 Fallback 적용

- 목적: 사용자가 선택한 언어에 맞춰 번역된 운영 콘텐츠를 렌더링하고, 미존재 시 Fallback 로직을 수행한다.
- 작업 범위:
  - 언어 상태의 쿠키(`ltax_lang`) 동기화 및 SSR 지원 로직 추가
  - 선택 언어 -> 영어 -> 한국어 원문 순서로 노출 로직 추가
- **실행 결과 (2026-05-13 완료)**:
  - `usePersonaThemeStore`에 쿠키 동기화 로직 추가.
  - `src/lib/content-translation.ts`에 서버 쿠키 조회 및 Fallback 병합 유틸 구현.
  - 공개 상세 화면 4종(`/stays`, `/experiences`, `/programs`, `/courses`)에 번역 Fallback 렌더링 통합 완료.

### T-056 AI 번역 초안 생성 Placeholder

- 목적: 관리자가 다국어 탭에서 손쉽게 기본 번역을 생성할 수 있도록 AI 프롬프트 연동 기반을 마련한다.
- 작업 범위:
  - "AI 초안 준비" 버튼 UI 배치 및 조건부 비활성화 (원문 부족 시)
  - 실제 API 연동이 아닌 향후 전달될 프롬프트 뷰어 모달(Placeholder) 구현
- **실행 결과 (2026-05-13 완료)**:
  - `src/components/admin/translations/translation-form.tsx`에 AI Placeholder 버튼 및 안내 모달 구현.
  - 실제 API 호출 및 외부 패키지 설치 일체 없음.
  - AI에 전달될 컨텍스트 및 금지어/관광 특성 룰을 담은 프롬프트 생성 헬퍼 추가.

### T-057 Persona Theme / i18n QA

- 목적: 4개 theme와 4개 language 조합에서 UI 깨짐과 텍스트 overflow를 점검한다.
- 작업 범위:
  - PC/mobile에서 주요 조합 확인
  - 긴 중국어/일본어/영어 문구 overflow 확인
  - `haengrang` 명조체 fallback 확인
  - CTA 버튼 대비 확인
  - `local` 사투리 문구가 과하지 않은지 검토
  - localStorage reset 후 기본값 확인
- 완료 기준:
  - 테마별 주요 화면 QA 결과 문서화
- **실행 결과 (2026-05-13 완료)**:
  - 페르소나 테마(4종) 및 언어(4종) 전환 시 UI 상태 정상 유지(localStorage/Cookie 동기화) 확인.
  - 공개 상세 화면(숙소, 체험, 주민소득상품, 코스)에서 `ltax_lang` 쿠키 기반 SSR 번역 Fallback 작동 검증.
  - 관리자 다국어 번역 UI의 AI Placeholder 렌더링 검증 및 실제 API 미호출 확인.
  - 모바일 네비게이션바와 테마/언어 선택기 UI 간 충돌 없음 확인.
  - Hydration Mismatch 등 치명적 콘솔 에러 없음 확인.

## 10순위: 운영 기능 고도화

### T-058 이미지 최적화

- 목적: 남아 있는 `<img>` LCP warning을 `next/image` 또는 로컬 최적화 전략으로 해소한다.
- 완료 기준:
  - `npm run lint`에서 이미지 LCP warning 0건
- **실행 결과 (2026-05-13 완료)**:
  - 공통 `ContentImage` 컴포넌트 생성 및 `next/image` 적용.
  - `StayImage`, `ExperienceImage`, `ProgramImage`, `CourseImage`, `MapItemCard` 컴포넌트를 `ContentImage` 기반으로 리팩토링.
  - 미설정 외부 도메인 로드 실패 시 `onError`를 통한 안전한 도메인별 Fallback UI 유지 구조 확립.
  - `npm run lint` 시 `@next/next/no-img-element` Warning 0건 달성.

### T-059 운영 로그/모니터링

- 목적: 운영 중 API 오류, 문의 저장 실패, LeadEvent 실패를 추적한다.
- 완료 기준:
  - 모니터링 도구와 alert 기준 문서화
- **실행 결과 (2026-05-13 완료)**:
  - `src/lib/operation-log.ts` 공통 로깅 헬퍼 작성 (PII 마스킹 및 Vercel Logs 친화적 JSON 포맷 지원).
  - 문의/입점/LeadEvent API에 `logOperationError`, `logOperationInfo` 적용 완료 (에러 발생 시 사용자 응답 분기 처리 적용).
  - Vercel Logs 모니터링 가이드 및 알림 기준을 담은 `docs/17_OPERATION_MONITORING.md` 신규 문서화.
  - QA 체크리스트(`docs/06_QA_CHECKLIST.md`) 운영 모니터링 항목 신규 반영.

### T-060 AI 실제 연동 기획

- 목적: AX 도우미 placeholder를 실제 AI API 기능으로 전환하기 위한 비용/승인/로그 기준을 정의한다.
- 완료 기준:
  - API provider, 비용 상한, 운영자 승인 workflow, 개인정보 처리 기준 문서화
- **실행 결과 (2026-05-13 완료)**:
  - `docs/18_AI_INTEGRATION_PLAN.md`를 신규 작성해 provider adapter 전략, 비활성 기본값, 비용 상한, 관리자 승인 workflow, 개인정보 제외 기준, 운영 로그 기준을 정리했다.
  - AI 실제 호출은 계속 비활성 상태로 유지한다. `AI_FEATURES_ENABLED=false`가 기본값이며, 별도 구현 티켓과 운영 승인 없이 API key를 등록하거나 호출하지 않는다.
  - 우선 적용 후보는 다국어 번역 초안, 상품 문안 초안, 홍보 카피 초안, 운영 인사이트 초안으로 제한한다.
  - 모든 AI 결과는 draft-only이며 운영자가 검토·수정·저장해야 한다. 자동 저장, 자동 공개, 공개 사용자 실시간 AI 추천은 제외한다.
  - `.env.example` 및 `docs/09_SECURITY_ENV.md`에 T-060 AI 환경변수 기준을 반영했다.
  - 후속 구현 티켓 후보를 T-072~T-077로 분리했다.

## 11순위: B2B Premium PR / 콘텐츠 제작대행 BM

이 영역은 MVP 범위가 아니다. 결제, 정산, 예약 확정 없이 숙소 상세 안에서 프리미엄 PR 콘텐츠를 노출하고, 운영자가 B2B 제작대행 신청과 노출 상태를 관리하는 Post-MVP BM 확장으로 다룬다.

기준 문서:

- [14_B2B_PREMIUM_PR.md](./14_B2B_PREMIUM_PR.md)

### T-061 Accommodation Premium PR JSON 필드 설계

- 목적: 기존 숙소 데이터 구조를 크게 흔들지 않고 프리미엄 PR 옵션을 저장할 수 있는 확장 필드를 추가한다.
- 작업 범위:
  - `Accommodation` 모델에 `premiumPr Json` 필드 추가 검토
  - 기본값은 `{"isPremium": false}`
  - PostgreSQL/Supabase에서는 Prisma `Json`이 JSONB로 저장되는 것을 전제로 한다.
  - JSON 구조 초안:
    - `isPremium`
    - `features.matterportUrl`
    - `features.hostVideoUrl`
    - `features.droneViewUrl`
    - `display.badgeLabel`
    - `contract.packageName`
    - `contract.expiresAt`
  - Prisma migration 또는 `db push` 적용 방식 결정
- 제외:
  - 결제, 정산, 구독 과금 자동화
  - 예약 확정 기능
- 완료 기준:
  - Prisma schema와 데이터 모델 문서에 `premiumPr` 구조가 정의되어 있다.
  - 기존 숙소 생성/수정/공개 조회가 깨지지 않는다.
- 실행 결과 (2026-05-14 완료):
  - `Accommodation.premiumPr Json @default("{\"isPremium\":false}")` 필드를 추가했다.
  - `src/lib/premium-pr.ts`에 `PremiumPrConfig`, `DEFAULT_PREMIUM_PR`, `normalizePremiumPr`, `isPremiumPrEnabled`, iframe URL allowlist 검증 함수를 추가했다.
  - 허용 iframe URL은 `my.matterport.com/show`, `www.youtube.com/embed`, `www.youtube-nocookie.com/embed`, `player.vimeo.com/video`로 제한했다.
  - `docs/03_DATA_MODEL.md`와 `docs/14_B2B_PREMIUM_PR.md`에 JSON 계약과 제외 범위를 반영했다.
  - T-061은 공개 UI, 관리자 입력 UI, LeadEvent 수집을 구현하지 않고 T-062~T-064로 넘긴다.

### T-062 숙소 상세 Premium PR 노출 UI

- 목적: 프리미엄 옵션을 구매한 숙소만 상세 페이지 안에서 VR/영상 콘텐츠를 노출한다.
- 작업 범위:
  - 숙소 대표 이미지 영역에 `VR로 미리보기` 또는 `3D 숙소 투어` 배지 조건부 노출
  - Matterport URL이 있으면 전체 화면 모달 iframe으로 표시
  - host video URL이 있으면 `호스트 이야기` 섹션 조건부 노출
  - drone video URL이 있으면 별도 영상/배지 조건부 노출
  - 옵션이 없는 숙소는 기존 상세 레이아웃 유지
- 보안 기준:
  - iframe URL은 allowlist 기반으로만 허용
    - `my.matterport.com`
    - `www.youtube.com/embed`
    - `www.youtube-nocookie.com/embed`
    - `player.vimeo.com`
  - 외부 URL 원문을 무검증 iframe에 넣지 않는다.
- 완료 기준:
  - 프리미엄 숙소와 일반 숙소의 상세 화면 분기가 안정적으로 동작한다.
  - 모바일에서 모달 닫기와 터치 영역이 정상 동작한다.

### T-063 관리자 Accommodation Premium PR 입력 UI

- 목적: 운영자가 숙소별 프리미엄 PR 옵션을 직접 등록/수정할 수 있게 한다.
- 작업 범위:
  - `/admin/stays` 생성/수정 폼에 `프리미엄 PR 적용` 체크박스 추가
  - 체크 시 URL 입력 영역 노출
    - Matterport URL
    - Host video embed URL
    - Drone video embed URL
    - 배지 문구
    - 패키지명
    - 노출 종료일
  - 서버 액션에서 JSON 구조 검증
  - URL allowlist 검증
  - `premiumPr.isPremium=false`이면 feature URL은 공개 화면에서 무시
- 완료 기준:
  - 관리자에서 프리미엄 PR 정보를 저장/수정할 수 있다.
  - 잘못된 URL은 서버에서 거부된다.

### T-064 Premium PR LeadEvent 수집

- 목적: 프리미엄 PR 콘텐츠의 성과를 측정할 수 있도록 클릭 이벤트를 수집한다.
- 작업 범위:
  - `VR로 미리보기` 클릭 이벤트 기록
  - `호스트 영상 보기` 또는 영상 섹션 진입 이벤트 기록
  - `드론 영상 보기` 클릭 이벤트 기록
  - 기존 `LeadEvent` 모델의 `metadata Json` 활용 여부 결정
  - 필요한 경우 `LeadEventType` enum 확장 검토
- 권장 이벤트 예시:
  - `premium_vr_click`
  - `premium_video_click`
  - `premium_drone_click`
- 완료 기준:
  - 프리미엄 콘텐츠 클릭이 관리자 성과 분석에 사용할 수 있는 형태로 저장된다.
  - LeadEvent 저장 실패가 사용자 경험을 막지 않는다.

### T-065 B2B 콘텐츠 제작대행 신청 폼

- 목적: 숙박업주가 플랫폼 안에서 프리미엄 PR 제작대행을 문의할 수 있게 한다.
- 작업 범위:
  - 공개 또는 파트너 영역에 `프리미엄 PR 제작 문의` 폼 추가
  - 수집 항목 최소화:
    - 숙소명
    - 담당자명
    - 연락처
    - 희망 상품
    - 요청 메모
    - 개인정보 동의
  - 상품 선택지:
    - 3D/VR 촬영
    - 호스트 인터뷰 영상
    - 드론 영상
    - 연간 프리미엄 노출
    - 상담 후 결정
  - 결제/계약 자동화는 제외하고 문의 접수까지만 구현
- 완료 기준:
  - 업주가 제작대행 상담 요청을 제출할 수 있다.
  - 저장 실패 시 성공으로 응답하지 않는다.

### T-066 B2B 제작대행 관리자 관리 화면

- 목적: 운영자/현장센터가 제작대행 문의를 접수하고 상태를 관리한다.
- 작업 범위:
  - `/admin/premium-requests` 또는 `/admin/b2b-requests` 관리 화면 추가
  - 상태값:
    - `new`
    - `quoted`
    - `scheduled`
    - `in_progress`
    - `published`
    - `completed`
    - `archived`
  - 개인정보 마스킹 적용
  - 상세 화면에서만 원문 메모 조회
  - 관리자 세션 검증을 서버 액션마다 적용
- 완료 기준:
  - 제작대행 문의 목록, 상세, 상태 변경이 가능하다.

### T-067 현장센터 제작 Workflow 문서화

- 목적: 플랫폼 운영 조직과 지역 활동가가 프리미엄 콘텐츠를 제작/납품하는 운영 절차를 정한다.
- 작업 범위:
  - 접수
  - 견적
  - 촬영 일정 조율
  - 촬영
  - 편집
  - 업주 확인
  - 플랫폼 등록
  - 노출 시작
  - 만료/갱신 안내
  - 청년 활동가 역할 정의
- 완료 기준:
  - 운영자가 실제 현장 업무에 쓸 수 있는 체크리스트가 문서화되어 있다.

### T-068 Premium PR QA / 보안 기준

- 목적: 프리미엄 PR 기능이 플랫폼 품질과 개인정보/보안 기준을 해치지 않도록 QA한다.
- QA 항목:
  - 일반 숙소에 프리미엄 섹션이 노출되지 않는다.
  - `isPremium=false`이면 URL이 있어도 공개 노출하지 않는다.
  - 허용되지 않은 iframe 도메인은 렌더링하지 않는다.
  - 모바일에서 VR 모달이 화면을 벗어나지 않는다.
  - 모달 닫기 버튼 터치 영역이 충분하다.
  - LeadEvent 실패 시 사용자는 계속 콘텐츠를 볼 수 있다.
  - 관리자 목록에서 신청자 개인정보는 마스킹된다.
  - 결제/예약 확정 문구가 노출되지 않는다.
- 완료 기준:
  - QA 결과가 문서화되고 P1/P2 이슈가 없다.

## 12순위: Event 운영 콘텐츠 정비

이 영역은 이벤트를 실제 운영 콘텐츠로 사용할 때 필요한 데이터 모델, 공개 조회, 관리자 운영 기준을 정리한다. 현재 `/events`는 fallback 중심 화면이고, 홈 이벤트 조회는 `status=published`만 사용한다. 다지역 확장 원칙을 유지하려면 Event도 region 기반 운영 콘텐츠로 정리해야 한다.

### T-069 Event regionId 및 공개 조회 구조 정비

- 목적: 이벤트를 실제 운영 콘텐츠로 사용하기 위해 `Event` 모델과 공개 조회 흐름을 region 기반으로 정리한다.
- 작업 범위:
  - `Event` 모델에 `regionId` 추가
  - `Region`과 `Event` relation 추가
  - `@@index([regionId, status])` 추가
  - 기존 seed/admin event 생성 로직에 `sowon` region 연결
  - 홈 이벤트 조회에 `regionId + status=published` 필터 적용
  - `/events` 페이지가 fallback만 쓰지 않고 실제 `Event` 데이터를 조회하도록 전환
  - `/api/lead-events` GET 의존 제거 또는 별도 `/api/events` 추가 여부 결정
  - draft/inactive 이벤트 비공개 확인
- 완료 기준:
  - Event가 다지역 확장 원칙을 따른다.
  - `/`, `/events`에서 소원권역 published 이벤트만 노출된다.
  - 이벤트가 없어도 fallback 또는 빈 상태 UI가 깨지지 않는다.
- **실행 결과 (2026-05-13 완료)**:
  - `Event.regionId` 및 `Region.events` relation을 추가하고 `@@index([regionId, status])`를 반영했다.
  - seed 이벤트를 `sowon` region에 연결하고, 공개 이벤트 3건과 draft 비노출 검증용 1건을 추가했다.
  - 홈 이벤트 조회를 `sowon regionId + status=published` 기준으로 변경했다.
  - `/events` 페이지를 `/api/lead-events` 의존 및 fallback 병합 구조에서 제거하고 서버 DB 조회 기반으로 전환했다.
  - 이벤트가 없을 때는 “진행 중인 소식이 없습니다” 빈 상태 UI를 표시하도록 정리했다.
  - 관리자 이벤트 생성은 기본 `sowon` region에 연결되며, 상태 변경/수정/삭제 후 `/`, `/events`, `/admin/events`를 revalidate한다.
  - Production DB schema 반영(`db push` 또는 migration)은 사용자 승인 전까지 실행하지 않았다.

### T-070 Event 관리자 CRUD region 검증

- 목적: 관리자 이벤트 생성/수정/상태 변경에서 region 검증과 공개 노출 정책을 보장한다.
- 작업 범위:
  - `/admin/events` 생성/수정 폼에 Region 선택 또는 기본 `sowon` 연결 적용
  - 서버 액션에서 관리자 세션 검증 유지
  - 서버 액션에서 region 존재 여부 검증
  - status allowlist 검증
  - 이벤트 삭제/비활성화 시 홈/이벤트 페이지 revalidate
- 완료 기준:
  - 관리자 이벤트 CRUD가 regionId와 status 정책을 지킨다.
- **실행 결과 (2026-05-13 완료)**:
  - `createEvent`, `updateEvent`, `updateEventStatus`, `deleteEvent` 모두 Server Action 시작부에서 `requireAdminSession()`을 직접 호출하도록 유지했다.
  - 수정/상태 변경/삭제 대상 Event는 `sowon` region에 속한 데이터인지 `findFirst({ id, regionId })`로 재검증한다.
  - 필수 문자열(`tag`, `title`, `subTitle`, `description`)은 서버에서 `trim()` 후 빈 값 저장을 거부한다.
  - `status`, `href`, `gradient`는 서버 allowlist 검증을 통과한 값만 저장한다.
  - 관리자 이벤트 폼의 이동 경로와 배경값 입력을 allowlist 기반 select로 정리해 운영 입력 오류를 줄였다.
  - 이벤트 변경 후 `/admin/events`, `/events`, `/`를 revalidate하도록 유지했다.

### T-071 Event 공개 노출 QA

- 목적: 이벤트 운영 콘텐츠가 공개 화면에서 정책에 맞게 노출되는지 검증한다.
- QA 항목:
  - published 이벤트만 공개 노출
  - draft/inactive 이벤트 비노출
  - 다른 region 이벤트 비노출
  - 이벤트 href가 허용된 내부 경로인지 검증
  - 이벤트 이미지/gradient fallback 확인
  - `/events` 빈 상태 확인
- 완료 기준:
  - Event 공개 노출 QA 결과가 문서화되고 P1/P2 이슈가 없다.
- **실행 결과 (2026-05-13 완료)**:
  - `/events`와 홈 이벤트 조회가 모두 `sowon` regionId와 `status=published` 조건을 사용함을 확인했다.
  - 공개 렌더링 전 `href`와 `gradient`를 `src/lib/event-policy.ts` allowlist 기준으로 정규화하도록 보완했다.
  - DB에 오래된 seed gradient 값이 남아 있어도 공개 화면과 관리자 폼이 깨지지 않도록 legacy gradient preset을 allowlist에 포함했다.
  - `/events` 탭 라벨, 빈 상태, footer의 깨진 한국어 문구를 정상 문구로 교정했다.
  - 홈 이벤트 슬라이더도 같은 `href`/`gradient` 정규화 함수를 사용하도록 정리했다.
# 완료 기록: Public DB Source of Truth 전환

- 적용일: 2026-05-13
- 목적: 공개 페이지가 fallback/mock 데이터와 DB 데이터를 섞어 보여주지 않도록 하고, 관리자 페이지에 등록된 실제 DB 데이터를 단일 기준으로 사용한다.
- 적용 범위: 홈, 숙소, 체험, 소원 별미(주민소득상품), 코스, 지도
- 결과:
  - `prisma/seed.ts`가 기존 공개 fallback 콘텐츠를 DB seed 입력원으로 사용하도록 정리됨.
  - 공개 페이지 runtime에서는 fallback 병합을 제거하고 `sowon` region + `published` 데이터만 조회함.
  - 관리자 입력 폼에 공개 화면 필터/카테고리용 선택 필드 저장을 보강함.
  - Neon DB에 schema push 및 seed 실행 완료.
- DB 확인 결과:
  - 숙소: 4개 / 공개 4개
  - 체험: 4개 / 공개 4개
  - 주민소득상품: 11개 / 공개 10개
  - 코스: 7개 / 공개 7개
- 검증:
  - `npx prisma validate` 통과
  - `npm run lint` 통과
  - `npm run build` 통과

## T-065~T-068 완료 기록

- T-065: `/partner/premium-pr` 제작대행 신청 폼과 `/api/premium-pr-applications` 저장 API를 추가했다.
- T-066: `/admin/premium-pr-applications` 목록/상세/상태 변경 화면을 추가했다.
- T-067: Premium PR 현장 제작 workflow 문서를 작성했다.
- T-068: Premium PR QA / 보안 기준 문서를 작성했다.
- 신규 DB 모델과 Prisma schema 변경 없이 기존 `PartnerApplication`과 `LeadEvent` 모델을 재사용한다.
- 결제, 정산, 구독 과금, 파일 업로드, 외부 API 연동은 제외 범위로 유지한다.

## T-079~T-081 보완 티켓 편성

### T-079 다국어 번역 P0 긴급 보완

- 목적: 실 고객 접점에 남은 한국어 하드코딩 문구를 제거한다.
- 작업 범위:
  - `src/components/inquiry/inquiry-dialog.tsx` 문의 팝업의 필드 라벨, placeholder, 버튼, 개인정보 동의 문구 다국어화
  - `src/components/layout/public-navigation-shell.tsx`의 `CategoryOverlay` 세부 카테고리 태그 다국어 매핑
  - `src/lib/static-translations.ts` 또는 현재 사용 중인 persona/i18n 사전에 필요한 key 추가
  - 한국어, English, 简体中文, 日本語 전환 QA
- 완료 기준:
  - 상세 페이지에서 "문의 남기기" 팝업을 열었을 때 현재 언어와 다른 하드코딩 문구가 보이지 않는다.
  - 모바일 카테고리 확장 메뉴의 세부 태그가 현재 언어로 표시된다.
- 권장 모델: Gemini 3.1 Pro High
- 이유: 다국어 key 설계와 기존 persona/i18n 구조 정합성 검토가 필요하다.
- 진행 상태: 완료
- 완료 기록:
  - `src/lib/static-translations.ts`에 문의 팝업과 모바일 카테고리 세부 태그용 정적 번역 key를 한국어, English, 简体中文, 日本語에 추가했다.
  - `src/components/inquiry/inquiry-dialog.tsx`의 필드 라벨, placeholder, 검증 오류, 개인정보 동의, 제출/성공 문구를 `getStaticLabels(locale)` 기반으로 전환했다.
  - `src/components/layout/public-navigation-shell.tsx`의 `CategoryOverlay` 세부 메뉴와 태그를 언어별 배열 key 기반 렌더링으로 전환했다.

### T-080 UI Placeholder 및 푸터 링크 사용성 보완

- 목적: 클릭 가능한 UI가 무반응으로 남아 사용자가 혼동하는 상태를 줄인다.
- 작업 범위:
  - GNB 상단 장바구니 버튼에 "준비 중" 알림 또는 비활성 상태 적용
  - GNB 상단 최근 본 상품 버튼에 "준비 중" 알림 또는 실제 최근 본 목록 연결 여부 결정
  - 홈/공개 푸터 전화번호에 `tel:` 링크 적용
  - 홈/공개 푸터 홈페이지 주소에 정상 하이퍼링크 적용
  - 모바일/PC 네비게이션 모두 확인
- 완료 기준:
  - 장바구니/최근 본 상품 클릭 시 무반응 상태가 없다.
  - 푸터 전화번호와 홈페이지 주소가 실제 연결된다.
- 권장 모델: Gemini 3 Flash
- 이유: 범위가 명확한 UI 보완 작업이다.
- 진행 상태: 완료
- **실행 결과 (2026-05-14 완료)**:
  - **Placeholder Alerts**: PC 상단 네비게이션(`public-navigation-shell.tsx`) 및 레거시 헤더(`main-header.tsx`)에 존재하던 미구현 '장바구니' 및 '최근 본 상품' 버튼의 클릭 리스너를 바인딩 완료. 다국어 대응을 위해 `src/lib/static-translations.ts` 내 `cartNotice` 및 `recentNotice` 키를 추가하여(KO, EN, ZH, JA) alert() 팝업으로 유려하게 안내됨.
  - **Home/Event Footer Enrichment**: 홈 화면 클라이언트 풋터(`home-client.tsx`) 및 이벤트 페이지(`events/page.tsx`) 내 하드코딩된 텍스트를 연결성 높은 링크들로 완벽 개선.
    - 전화번호: `tel:010-0233-4548` 링크 적용 완료
    - 홈페이지: `https://www.sowontrip.com` 외부 링크 전환 (target blank / rel noreferrer)
    - 고객센터 / 입점신청: 내부 `/customer-center` 및 `/partner/apply` 라우트로의 Active Link 추가 완료.
  - **Admin Entrance**: 관리자 페이지 임시 진입 버튼은 제거하지 않되, 운영 편의용 목적을 강화하여 툴팁(`title`)과 접근성 뱃지(`aria-label`)에 '운영 전용' 문구를 명시함.
  - **Decoupling from T-089**: 이번 작업은 개별 화면에 분절되어 있던 임시 풋터 링크를 정비하는 보완 작업에 국한되었으며, 전역 푸터 공통 컴포넌트 추출 및 통합 배포 과제는 향후 T-089의 온전한 범위로 보존시킴.


### T-081 번역 운영 자동화 및 DB 캐시 아키텍처 설계

- 목적: 신규 DB 콘텐츠 추가 시 수동 번역 매핑 누락을 줄이는 장기 구조를 설계한다.
- 작업 범위:
  - `ContentTranslation` 모델 기반 번역 캐시 운영 흐름 정리
  - AI 실시간 번역 후보 생성, 관리자 검수, 공개 반영 workflow 설계
  - 비용 제한, rate limit, 개인정보 제외, 관리자 승인 정책 정의
  - 실제 AI API 호출은 구현하지 않고 설계 문서와 후속 티켓만 작성
- 완료 기준:
  - 신규 콘텐츠 등록 후 번역 생성/검수/캐시/공개 노출 흐름이 문서화된다.
  - AI API 연동 전 필요한 환경변수, 보안, 비용 기준이 명확하다.
- 권장 모델: Claude Sonnet 4.6 Thinking 또는 Gemini 3.1 Pro High
- 이유: 운영 아키텍처, 비용, 개인정보, 관리자 workflow 판단이 필요하다.

## T-076 운영 Smoke Test 자동화 완료 기록

- 진행 상태: 완료
- 완료 기록:
  - `scripts/smoke-test.mjs`를 추가해 공개 route status, 관리자 redirect, 주요 공개 API invalid body rejection을 자동 확인하도록 했다.
  - `package.json`에 `npm run smoke` 스크립트를 추가했다.
  - 기준 URL은 `SMOKE_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, `http://localhost:3000` 순서로 결정한다.
  - `/api/lead-events`는 사용자 CTA를 막지 않는 best-effort 정책이므로 실패 조건이 아니라 warning 성격의 optional check로 분리했다.
  - `README.md`와 `docs/12_PRE_LAUNCH_CHECKLIST.md`에 운영 실행 방법과 완료 기준을 반영했다.
- 완료 기준:
  - `npm run lint` 통과
  - `npm run build` 통과
  - 실행 가능한 smoke-test command 제공

## T-082~T-087 관광객 맞춤코스 및 사용자 대시보드

현재 공개 네비게이션의 `마이`는 `/admin`으로 연결되어 있다. `/admin`은 플랫폼 운영자 전용 관리자 화면이므로 관광객용 마이페이지와 분리해야 한다. 관광객 계정, 맞춤코스, 예약현황, 결제내역, 알림은 MVP 범위 밖이므로 Post-MVP 확장 티켓으로 편성한다.

상세 명세: `docs/23_USER_PERSONALIZATION_DASHBOARD_SPEC.md`

### T-082 공개 네비 `마이` 라우팅 분리 및 관광객 `/my` placeholder

- 목적: 공개 사용자용 `마이`와 운영자용 `/admin`을 분리한다.
- 작업 범위:
  - `src/components/layout/public-navigation-shell.tsx`의 desktop/mobile `마이` 링크를 `/admin`에서 `/my`로 변경
  - `/my` 라우트 추가
  - `/my`는 관광객용 게스트 대시보드 placeholder로 구현
  - 관리자 진입은 `/admin/login` 또는 운영자 전용 URL로만 유지
  - 결제내역/예약현황은 실제 기능 없이 준비 중 또는 문의 기반 안내로 표시
- 완료 기준:
  - 공개 페이지에서 `마이` 클릭 시 `/admin`으로 이동하지 않는다.
  - `/my`는 비로그인 관광객에게도 안전하게 렌더링된다.
  - `/admin`은 기존 관리자 인증 정책을 유지한다.
- 권장 모델: Gemini 3 Flash
- 진행 상태: 완료
- 완료 기록:
  - `src/components/layout/public-navigation-shell.tsx`의 PC/모바일 `마이` 링크를 `/admin`에서 `/my`로 변경했다.
  - `src/app/my/page.tsx`를 추가해 비로그인 관광객도 접근 가능한 게스트 대시보드 placeholder를 구현했다.
  - `/my`에는 맞춤코스, 찜 목록, 문의 내역, 예약현황, 결제내역, 알림 섹션을 준비 상태로 표시하되 예약 확정/결제 완료처럼 오해될 문구는 사용하지 않았다.
  - 기존 운영자 관리자 경로 `/admin`과 `/admin/login`은 수정하지 않았다.

### T-083 맞춤코스 빌더 MVP Lite

- 목적: 사용자가 숙박, 음식/주민소득상품, 체험을 직접 조합해 임시 코스를 만들 수 있게 한다.
- 작업 범위:
  - `/course-builder` 또는 `/my/trips/new` 라우트 추가
  - published 숙소, 체험, 주민소득상품을 선택 후보로 조회
  - 항목 추가/삭제/순서 변경 UI 구현
  - localStorage 기반 임시 저장
  - 맞춤코스 결과에서 문의 CTA 연결
  - 결제, 예약 확정, 재고 확인은 제외
- 완료 기준:
  - 사용자가 2개 이상 콘텐츠를 조합해 하나의 임시 코스를 만들 수 있다.
  - 새로고침 후에도 localStorage 기반 임시 코스가 유지된다.
  - 예약/결제 확정처럼 오해될 문구가 없다.
- 권장 모델: Gemini 3.1 Pro High
- 진행 상태: 완료
- 완료 기록:
  - `/course-builder` 공개 라우트를 추가했다.
  - `/my/trips/new`는 `/course-builder`로 redirect한다.
  - published 숙소, 체험, 주민소득상품을 DB 기준으로 조회하고 DB 미연결 시 fallback으로 렌더링한다.
  - 항목 추가/삭제/순서 변경, 여정 메모, localStorage 저장을 구현했다.
  - 문의 CTA는 `/customer-center`로 연결하고 예약 확정/결제/재고 확인 기능은 넣지 않았다.

### T-084 관광객 Auth 및 사용자 데이터 모델 설계

- 목적: 관광객 계정 기능 도입 전 인증/권한/개인정보/데이터 모델을 확정한다.
- 작업 범위:
  - 관광객 로그인 방식 검토
  - 관리자 계정과 관광객 계정 분리
  - `TouristUser`, `TouristProfile`, `SavedTripPlan`, `SavedTripPlanItem`, `UserNotification` 모델 초안 작성
  - 예약/결제 관련 모델은 placeholder 또는 별도 승인 대상임을 명시
- 완료 기준:
  - 관광객 계정과 운영자 관리자 권한이 분리된 구조로 문서화된다.
  - Prisma schema 변경 여부와 migration 전략이 정리된다.
- 권장 모델: Claude Sonnet 4.6 Thinking
- 진행 상태: 완료
- 완료 기록:
  - `docs/24_TOURIST_AUTH_DATA_MODEL_SPEC.md`를 추가했다.
  - 관리자 세션과 관광객 세션을 분리하는 원칙을 명시했다.
  - `TouristUser`, `TouristProfile`, `SavedTripPlan`, `SavedTripPlanItem`, `UserNotification` 모델 초안을 문서화했다.
  - 이번 티켓에서는 실제 Auth 구현과 Prisma migration을 수행하지 않는 것으로 범위를 고정했다.

### T-085 관광객 대시보드 1차 구현

- 목적: `/my`에 관광객용 대시보드 shell을 구축한다.
- 작업 범위:
  - 맞춤코스
  - 찜 목록
  - 최근 본 콘텐츠
  - 문의한 항목 안내
  - 예약현황 placeholder
  - 결제내역 placeholder
  - 알림 placeholder
  - Auth 미도입 상태에서는 localStorage 기반 표시
- 완료 기준:
  - 관광객이 `/my`에서 자신의 임시 활동 데이터를 확인할 수 있다.
  - 결제/예약 확정 데이터가 없는 상태를 명확히 표시한다.
- 권장 모델: Gemini 3.1 Pro High

### T-086 예약현황/결제내역 정책 결정

- 목적: 실제 예약/결제 기능을 도입할지, 외부 연결/문의 상태 표시까지만 할지 결정한다.
- 작업 범위:
  - PG, 환불/취소, 정산, 재고, 개인정보 보관 범위 검토
  - MVP 문의·연결 중심 원칙과 충돌 여부 검토
  - 실제 결제 도입 전 필요한 운영 계약과 법무 체크리스트 작성
- 완료 기준:
  - `/my`의 예약현황/결제내역 표현 범위가 확정된다.
  - 실제 결제/예약 확정 구현 여부가 별도 승인 대상으로 분리된다.
- 권장 모델: Claude Sonnet 4.6 Thinking

### T-087 관광객 알림 센터 설계

- 목적: 관광객 대시보드에 표시할 알림의 구조와 동의 정책을 설계한다.
- 작업 범위:
  - 문의 접수 알림
  - 맞춤코스 저장 알림
  - 이벤트/혜택 알림
  - 운영자 답변 알림
  - 마케팅 수신 동의와 개인정보 동의 분리
- 완료 기준:
  - 알림 유형, 보관 기간, 수신 동의 기준이 문서화된다.
  - 실제 push/email/SMS 발송은 별도 티켓으로 분리된다.
- 권장 모델: Gemini 3.1 Pro High

### T-088 홈 플로팅 페르소나·언어 재선택 배너

- 목적: 사용자가 첫 진입 때 선택했던 페르소나 테마와 언어를 홈 화면에서 언제든 다시 선택할 수 있게 한다.
- 배경:
  - 현재 첫 방문 온보딩과 GNB 언어/테마 모달은 존재하지만, 홈 화면에서 즉시 보이는 재진입점은 부족하다.
  - 외국인 방문자는 첫 진입 시점부터 English, 简体中文, 日本語 선택지를 명확히 볼 수 있어야 한다.
  - 중국어/일본어 방문자는 KR | KRW 버튼을 찾아야만 언어를 바꿀 수 있는 구조보다, 초기 온보딩과 홈 플로팅 배너 안에서 바로 선택할 수 있는 구조가 더 적합하다.
- 작업 범위:
  - 홈 화면 우측 하단에 페르소나·언어 재선택 플로팅 배너 추가
  - 모바일에서는 하단 네비와 겹치지 않도록 하단 네비 위 플로팅 pill 또는 bottom sheet trigger로 배치
  - 플로팅 배너 클릭 시 현재 `PersonaOnboardingDialog` 또는 재사용 가능한 selector panel을 열어 페르소나를 다시 선택할 수 있게 구성
  - 초기 온보딩 화면에 언어 선택 영역 추가
    - 한국어
    - English
    - 简体中文
    - 日本語
  - 플로팅 배너 내부에도 동일한 언어 선택 UI 제공
  - 언어 선택 시 `usePersonaThemeStore.currentLang`, `ltax_lang` cookie, `localStorage` 상태가 일관되게 동기화되도록 설계
  - 현재 선택된 페르소나와 언어를 배너에 짧게 표시
  - `/admin`, `/admin/login` 등 관리자 화면에서는 노출하지 않음
- UI 기획:
  - Desktop: 홈 우측 하단 고정 배너
    - 예: "여행 취향·언어 바꾸기"
    - 현재 상태 예: "소원머묾 · JP"
  - Mobile: 하단 네비 높이를 고려해 `bottom: calc(80px + env(safe-area-inset-bottom))` 수준으로 배치
  - 배너는 닫기 버튼을 제공하되, 닫아도 설정 진입점이 완전히 사라지지 않도록 축약 아이콘 상태를 유지
  - 사투리/로컬 테마 선택 시에도 언어 선택은 별도로 유지
- 제외 범위:
  - URL 기반 locale 라우팅(`/en`, `/zh-cn`, `/ja-jp`) 도입 제외
  - 자동 브라우저 언어 감지 강제 전환 제외
  - AI 번역 API 호출 제외
  - DB schema 변경 제외
  - 결제, 예약 확정, 회원가입과 연결 제외
- 완료 기준:
  - 첫 방문 온보딩에서 KO/EN/ZH/JA 언어 선택이 가능하다.
  - 홈 우측 하단 플로팅 배너에서 페르소나와 언어를 다시 선택할 수 있다.
  - 선택값이 새로고침 후에도 유지된다.
  - 모바일에서 하단 네비와 배너가 겹치지 않는다.
  - `/admin` 계열 화면에는 배너가 노출되지 않는다.
  - `npm run lint`, `npm run build`가 통과한다.
- 권장 모델: Gemini 3.1 Pro High
- 이유: 기존 온보딩, Zustand 상태, cookie 기반 SSR 언어 동기화, 모바일 네비 레이아웃을 함께 건드리는 UI/상태 연동 작업이다.

### T-089 공개 전역 푸터 공통화 및 전체 페이지 적용

- 목적: 메인 화면에만 제한적으로 보이는 푸터를 공개 전체 페이지에 일관 적용한다.
- 배경:
  - 현재 홈 화면에는 푸터가 있으나 `/stays`, `/experiences`, `/programs`, `/courses`, `/events`, `/map`, `/partner/apply`, `/customer-center` 및 상세 페이지에는 푸터가 누락되거나 페이지별로 분산되어 있다.
  - T-080은 푸터 전화번호/홈페이지 링크 사용성 보완 중심이었고, 전역 레이아웃 공통화는 별도 작업으로 분리해야 한다.
- 작업 범위:
  - `src/components/layout/public-footer.tsx` 공통 컴포넌트 생성
  - `PublicNavigationShell` 또는 공개 route layout 레벨에서 관리자(`/admin`)를 제외한 공개 페이지에 푸터 적용
  - 홈/이벤트 등 기존 페이지 내부 푸터가 있다면 중복 노출되지 않도록 정리
  - 푸터 기본 구성:
    - 브랜드명
    - 고객센터 또는 문의 링크
    - 전화번호 `tel:` 링크
    - 홈페이지/운영 URL 링크
    - 파트너 입점 신청 링크
    - 개인정보/이용안내 placeholder 또는 고객센터 연결
  - 모바일 하단 네비와 겹치지 않도록 하단 여백 적용
  - 언어 상태에 맞춰 최소 UI 문구 다국어 key 적용
  - 관리자 화면과 관리자 로그인 화면에는 푸터 미노출
- 적용 대상:
  - `/`
  - `/stays`, `/stays/[slug]`
  - `/experiences`, `/experiences/[slug]`
  - `/programs`, `/programs/[slug]`
  - `/courses`, `/courses/[slug]`
  - `/events`
  - `/map`
  - `/partner/apply`
  - `/partner/premium-pr`
  - `/customer-center`
  - `/my`
- 제외 범위:
  - 별도 회사 소개 페이지 신규 제작 제외
  - 법무 문서 전문 작성 제외
  - 관리자 레이아웃 수정 제외
  - DB schema 변경 제외
- 완료 기준:
  - 공개 전체 페이지에서 동일한 푸터가 보인다.
  - 홈과 이벤트 페이지에서 푸터가 중복 노출되지 않는다.
  - 모바일 하단 네비와 푸터 텍스트/링크가 겹치지 않는다.
  - 전화번호와 홈페이지는 실제 클릭 가능한 링크로 동작한다.
  - `/admin` 계열에는 푸터가 노출되지 않는다.
  - `npm run lint`, `npm run build`가 통과한다.
- 권장 모델: Gemini 3 Flash
- 이유: 범위가 명확한 공통 레이아웃 정리 작업이며, 복잡한 데이터/인증 판단은 없다.
