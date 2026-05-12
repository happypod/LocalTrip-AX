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

### T-033 모바일/PC 실기기 QA

- 목적: 실제 사용자 환경에서 레이아웃, 네비, CTA, 폼 사용성을 확인한다.
- 작업 범위:
  - 모바일 Safari/Chrome 확인
  - PC Chrome/Edge 확인
  - 모바일 하단 네비 겹침 여부 확인
  - PC 상단 네비 sticky 동작 확인
  - CTA 터치 영역 44px 이상 확인
  - 폼 입력/동의/에러 표시 확인
- 완료 기준:
  - 실기기 QA 결과와 수정 필요 항목이 정리됨

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

### T-039 운영 도메인 연결 여부 결정

- 목적: Vercel 기본 도메인으로 운영할지, 별도 도메인을 연결할지 결정한다.
- 작업 범위:
  - 현재 Production URL 유지 여부 결정
  - 커스텀 도메인 후보 확인
  - DNS 연결 필요 시 절차 정의
  - `NEXT_PUBLIC_SITE_URL` 업데이트 필요 여부 확인
- 완료 기준:
  - 운영 도메인 정책 문서화

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
  - 실기기 QA 결과
  - known issue
  - 출시 승인/보류 판단
- 완료 기준:
  - 출시 가능 여부가 문서로 명확히 남음

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

### T-043 PersonaThemeProvider 구현

- 목적: 전역 상태로 현재 theme/language/currency를 관리한다.
- 구현 기준:
  - Zustand는 설치하지 않는다.
  - React Context + localStorage 기반으로 구현한다.
  - 기본 theme: `meomulm`
  - 기본 language: `ko`
  - 기본 currency: `KRW`
- localStorage key:
  - `sowon-persona-theme`
  - `sowon-persona-language`
  - `sowon-persona-currency`
  - `sowon-persona-onboarded`
- 작업 범위:
  - `src/components/theme/persona-theme-provider.tsx`
  - `src/components/theme/use-persona-theme.ts`
  - body class에 `theme-${themeId}` 적용
  - hydration mismatch 방지
- 완료 기준:
  - 새로고침 후에도 선택한 theme/language/currency가 유지된다.
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

### T-046 Theme Selector UI

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

### T-047 First Visit Theme Onboarding

- 목적: 첫 방문자에게 여행 목적 기반 테마 추천 팝업을 제공한다.
- 질문:
  - `이번 태안 여행, 어떤 시간을 기대하시나요?`
- 선택지:
  - `아이들과 갯벌에서 신나게 놀고 싶어요!` -> `masil`
  - `조용히 파도 소리 들으며 쉬고 싶어요.` -> `haengrang`
  - `바다를 보며 영감을 얻는 나만의 시간이 필요해요.` -> `meomulm`
  - `현지 말맛으로 둘러볼래유.` -> `local`
- 저장:
  - `sowon-persona-onboarded=true`
- 완료 기준:
  - 첫 방문 시 팝업 노출
  - 선택 후 테마 적용
  - 재방문 시 미노출

### T-048 Persona Theme / i18n QA

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

## 10순위: 운영 기능 고도화

### T-049 지도 API 연동 기획

- 목적: `/map` placeholder를 실제 지도 API로 전환하기 위한 기술/비용/데이터 기준을 정한다.
- 완료 기준:
  - 지도 API 후보, 비용, 키 관리, 좌표 데이터 정책 문서화

### T-050 이미지 최적화

- 목적: 남아 있는 `<img>` LCP warning을 `next/image` 또는 로컬 최적화 전략으로 해소한다.
- 완료 기준:
  - `npm run lint`에서 이미지 LCP warning 0건

### T-051 운영 로그/모니터링

- 목적: 운영 중 API 오류, 문의 저장 실패, LeadEvent 실패를 추적한다.
- 완료 기준:
  - 모니터링 도구와 alert 기준 문서화

### T-052 AI 실제 연동 기획

- 목적: AX 도우미 placeholder를 실제 AI API 기능으로 전환하기 위한 비용/승인/로그 기준을 정의한다.
- 완료 기준:
  - API provider, 비용 상한, 운영자 승인 workflow, 개인정보 처리 기준 문서화

## 11순위: B2B Premium PR / 콘텐츠 제작대행 BM

이 영역은 MVP 범위가 아니다. 결제, 정산, 예약 확정 없이 숙소 상세 안에서 프리미엄 PR 콘텐츠를 노출하고, 운영자가 B2B 제작대행 신청과 노출 상태를 관리하는 Post-MVP BM 확장으로 다룬다.

기준 문서:

- [14_B2B_PREMIUM_PR.md](./14_B2B_PREMIUM_PR.md)

### T-053 Accommodation Premium PR JSON 필드 설계

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

### T-054 숙소 상세 Premium PR 노출 UI

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

### T-055 관리자 Accommodation Premium PR 입력 UI

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

### T-056 Premium PR LeadEvent 수집

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

### T-057 B2B 콘텐츠 제작대행 신청 폼

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

### T-058 B2B 제작대행 관리자 관리 화면

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

### T-059 현장센터 제작 Workflow 문서화

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

### T-060 Premium PR QA / 보안 기준

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
