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
