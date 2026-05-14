# LocalTrip AX 전체 구성 모니터링 및 보완 명세서

작성일: 2026-05-14

## 1. 점검 목적

현재까지 구현된 LocalTrip AX / 소원로컬트립 MVP 및 Post-MVP 확장 기능을 대상으로 공개 화면, 관리자 화면, 데이터 모델, API, 배포/운영 문서의 이상 여부를 점검한다.

이번 문서는 즉시 코드 변경을 수행하는 문서가 아니라, 다음 작업자가 수정·보완·교체·추가·삭제 작업을 안전하게 진행할 수 있도록 기준을 정리하는 운영 명세서다.

## 2. 현재 구성 요약

### 공개 화면

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

### 관리자 화면

- `/admin`
- `/admin/regions`
- `/admin/businesses`
- `/admin/stays`
- `/admin/experiences`
- `/admin/programs`
- `/admin/courses`
- `/admin/events`
- `/admin/inquiries`
- `/admin/partner-applications`
- `/admin/premium-pr-applications`
- `/admin/training`
- `/admin/reports`
- `/admin/ai-assistant`

### 주요 데이터 모델

- `Region`
- `BusinessProfile`
- `Accommodation`
- `Experience`
- `LocalIncomeProgram`
- `Course`, `CourseItem`
- `Event`
- `Inquiry`
- `PartnerApplication`
- `LeadEvent`
- `TrainingCourse`
- `Certification`
- `ContentTranslation`

### 운영 방향

- 공개 콘텐츠는 DB 기준으로 노출한다.
- 주요 공개 조회는 `sowon` region과 `published` 상태를 기준으로 한다.
- 결제, 정산, 실시간 예약 확정, 운송, 후기, 쿠폰, 포인트는 여전히 MVP 제외다.
- Premium PR은 결제/구독 구현이 아니라 문의·제작대행 접수와 관리자 운영 구조까지만 포함한다.

## 3. 검증 결과

### 통과 항목

- Prisma schema validation 통과
- ESLint 통과
- Production build 통과
- 주요 App Router 경로가 빌드 결과에 포함됨
- 관리자 세션은 서명 토큰과 만료 시간을 검증하는 구조로 개선되어 있음
- 문의, 입점신청, Premium PR 신청은 저장 실패 시 성공으로 응답하지 않고 실패 응답을 반환함
- 공개 숙소/체험/주민소득상품/코스/이벤트 조회는 대체로 `regionId + published` 기준을 따른다.

### 남은 운영 리스크

- 공개 쓰기 API에 rate limit 또는 봇 방어가 없다.
- 일부 관리자 페이지가 DB 조회를 먼저 실행한 뒤 `AdminShell`에서 인증을 확인한다.
- Prisma query logging이 운영에서도 켜질 수 있다.
- 지도 타입/지역 상수 파일이 seed fallback 데이터를 함께 import하고 있어 DB 단일 기준 정책과 번들 관점에서 분리가 필요하다.
- CSP는 아직 적용되지 않았다.
- `NEXT_PUBLIC_SITE_URL` Production 환경변수는 문서상 최종 공개 전 등록 필요 항목으로 남아 있다.

## 4. 수정 명세

| ID | 우선순위 | 대상 | 수정 내용 | 이유 | 완료 기준 |
|---|---:|---|---|---|---|
| FIX-001 | P1 | 공개 쓰기 API | `/api/inquiries`, `/api/partner-applications`, `/api/premium-pr-applications`, `/api/lead-events`, `/api/lead-events/map`에 rate limit 또는 Vercel Firewall/WAF 기준 추가 | 공개 운영 시 DB 스팸, LeadEvent 폭증, 문의 테이블 오염 가능 | **[완료] T-072에서 인메모리 적용 및 WAF 기준 문서화 완료** |
| FIX-002 | P2 | 관리자 페이지 | DB 조회가 있는 관리자 `page.tsx`에서 `requireAdminSession()`을 데이터 조회보다 먼저 호출 | 비인증 요청이 DB 조회를 유발하는 구조 제거 | **[완료] T-073에서 8개 누락 파일 전수 적용 및 선검증 구조로 통일 완료** |
| FIX-003 | P2 | Prisma client | `src/lib/prisma.ts`의 `log: ["query"]`를 development 환경으로 제한 | 운영 로그 비용 증가 및 쿼리 노출 리스크 감소 | **[완료] T-074에서 process.env.NODE_ENV 분기 통해 운영 환경 query 로그 차단 및 풀링 정책 문서화 완료** |
| FIX-004 | P2 | 지도 데이터 구조 | `src/lib/map-data.ts`에서 seed fallback import와 `FALLBACK_MAP_ITEMS`를 분리 또는 삭제 | 공개 지도는 DB 기준이어야 하며, client bundle에 seed fallback 배열이 섞이지 않도록 정리 | 지도 UI 상수와 타입만 남긴 lean module로 분리 |
| FIX-005 | P2 | 환경변수 | Vercel Production에 `NEXT_PUBLIC_SITE_URL` 등록 및 재배포 | canonical URL, 공유 URL, metadata 확장 전 필수 | Vercel Production env에 현재 운영 URL 또는 커스텀 도메인 등록 |
| FIX-006 | P2 | 보안 헤더 | CSP 적용 설계 및 단계적 도입 | 현재 기본 보안 헤더는 있으나 script/frame/img 제어가 부족 | **[완료] T-077에서 Content-Security-Policy 기본 정책 강제 적용 및 Premium PR iframe sandbox 보완 완료** |
| FIX-007 | P3 | 관리자 UX | 주요 관리자 동적 페이지에 `error.tsx`, `loading.tsx` 추가 | DB 일시 장애나 느린 조회 시 운영자 경험 개선 | admin 공통 loading/error 또는 segment-level fallback 제공 |
| FIX-008 | P3 | 문서 번호 체계 | `docs/15_*`, `docs/16_*`, `docs/17_*`, `docs/18_*` 중복 번호 정리 | 티켓 문서와 전략 문서 번호가 겹쳐 인계 혼란 가능 | 전략 문서는 `STRATEGY_*`, 티켓 문서는 `T###_*` 형식으로 재정렬 |

## 5. 보완 명세

| ID | 우선순위 | 대상 | 보완 내용 | 이유 |
|---|---:|---|---|---|
| IMP-001 | P2 | 관리자 권한 | 현재는 플랫폼 관리자 단일 권한 구조임을 문서와 UI에 명확히 표시 | 숙박/체험 운영자별 대시보드가 이미 있는 것으로 오해하지 않도록 방지 |
| IMP-002 | P2 | 월간 리포트/성과 관리 | LeadEvent targetType 표준값을 문서화하고 테스트 데이터와 맞춤 | `local_income_program`, `course`, `general` 등 집계 키 불일치 방지 |
| IMP-003 | P3 | 지도 | 좌표 미입력 콘텐츠의 운영 상태를 관리자에서 쉽게 확인하는 필터 추가 | 지도 화면에서 "위치 준비 중" 콘텐츠가 많아질 때 운영자가 보완하기 쉬움 |
| IMP-004 | P3 | Premium PR | Premium PR 신청과 일반 입점신청의 운영 상태/통계 분리 표시 | B2B BM 성과를 일반 입점문의와 분리해서 보기 위함 |
| IMP-005 | P3 | 다국어 | 번역 누락 콘텐츠를 관리자에서 일괄 점검하는 뷰 추가 | 콘텐츠가 늘어날수록 누락 번역 탐지가 어려워짐 |

## 6. 교체 명세

| ID | 우선순위 | 현재 방식 | 교체 제안 | 이유 |
|---|---:|---|---|---|
| REP-001 | P2 | `src/lib/*-data.ts` fallback 타입과 seed 참고가 런타임 코드와 혼재 | UI 타입은 `src/types/content.ts` 같은 별도 타입 파일로 분리, seed 입력원은 `prisma/seed-data/*`로 이동 | DB Source of Truth 원칙 강화 |
| REP-002 | P3 | 일부 페이지가 직접 DB 조회와 UI 조립을 동시에 수행 | 공개 조회 helper를 `src/lib/public-content.ts` 등으로 통합 | region/status/translation 정책 중복 감소 |
| REP-003 | P3 | 관리자 폼별 validation 중복 | 공통 slug/status/map/premiumPr validation helper로 통합 | 새 CRUD 추가 시 검증 누락 감소 |

## 7. 추가 명세

| ID | 우선순위 | 추가 항목 | 설명 |
|---|---:|---|---|
| ADD-001 | P1 | 운영 Smoke Test 스크립트 | 완료: `scripts/smoke-test.mjs`와 `npm run smoke`로 공개 route, 관리자 redirect, 주요 API negative test를 자동 확인 |
| ADD-002 | P2 | API negative test | privacy 미동의, 잘못된 enum, 잘못된 region, 빈 body 요청에 대한 상태 코드 검증 |
| ADD-003 | P2 | DB content consistency script | 공개 DB 콘텐츠 수와 관리자 콘텐츠 수를 모델별로 비교 |
| ADD-004 | P3 | 이미지 URL 점검 스크립트 | public 이미지 경로/외부 이미지 URL 응답 실패를 일괄 탐지 |
| ADD-005 | P3 | 번역 coverage report | targetType/locale별 번역 누락률 리포트 |

## 8. 삭제 명세

| ID | 우선순위 | 삭제 대상 | 삭제 또는 축소 이유 | 조건 |
|---|---:|---|---|---|
| DEL-001 | P2 | 공개 런타임에서 쓰이지 않는 fallback map/content export | DB 단일 기준 정책과 번들 크기 정리 | seed 입력원 또는 타입 참조로만 남길 경우 위치 이동 후 삭제 |
| DEL-002 | P3 | 오래된 T-001~T-020 중복/상충 문구 | 현재 구현과 다른 과거 지시가 남으면 신규 작업자가 오해 | 최신 구현 기준으로 superseded 표시 후 정리 |
| DEL-003 | P3 | 사용하지 않는 map shell 또는 placeholder 중복 컴포넌트 | 지도 구조가 실제 Naver Map + fallback으로 정착되었으므로 중복 UI 축소 | 실제 import 미사용 확인 후 삭제 |

## 9. 공개 운영 전 필수 체크

1. Vercel Production `NEXT_PUBLIC_SITE_URL` 등록
2. 공개 쓰기 API rate limit 또는 WAF 정책 적용
3. 관리자 DB 조회 전 인증 순서 정리
4. Prisma production query log 비활성화
5. 실제 모바일 기기에서 홈, 상세, 문의, 지도, 관리자 로그인 테스트
6. Neon DB 백업/복구 절차 확인
7. Premium PR iframe allowlist와 CSP 도입 계획 확정

## 10. 권장 다음 티켓

### T-072 공개 API Rate Limit 및 WAF 기준 정리

- `/api/inquiries`
- `/api/partner-applications`
- `/api/premium-pr-applications`
- `/api/lead-events`
- `/api/lead-events/map`

### T-073 관리자 인증 선검증 리팩터링

- DB 조회 이전 `requireAdminSession()` 호출
- AdminShell은 레이아웃 표시용으로 유지

### T-074 Prisma 운영 로그 및 DB Pool 설정 정리

- production query log 비활성
- Neon/Vercel 환경에 맞는 pool max 재검토

### T-075 Runtime Fallback 데이터 분리

- `src/lib/map-data.ts` 정리
- fallback seed 입력원과 UI 타입 분리

### T-076 운영 Smoke Test 자동화

- 공개 route status 확인
- 관리자 redirect 확인
- 주요 API validation negative test
- 완료: `scripts/smoke-test.mjs` 추가
- 완료: `package.json`에 `npm run smoke` 추가
- 완료: `README.md`, `docs/12_PRE_LAUNCH_CHECKLIST.md`에 실행 방법과 launch gate 기준 반영
- 기준 URL: `SMOKE_BASE_URL` > `NEXT_PUBLIC_SITE_URL` > `http://localhost:3000`

### T-077 CSP 및 외부 임베드 보안 정책

- Naver Map script
- YouTube/Vimeo/Matterport iframe
- 이미지 source
- Next runtime asset

### T-078 문서 번호 체계 재정렬

- 전략 문서와 티켓 문서 번호 충돌 정리
- 최신 구현 기준 superseded 표시

### T-079 다국어 번역 P0 긴급 보완

- `InquiryDialog` 문의 팝업 내부 필드 라벨, 버튼, 개인정보 동의 문구를 현재 언어 상태에 맞게 번역한다.
- `CategoryOverlay` 모바일 카테고리 확장 메뉴의 세부 태그를 다국어 사전에 추가한다.
- 한국어 하드코딩 문구가 실 고객 접점에 남지 않도록 공개 CTA 흐름을 점검한다.
- 완료 기준: 한국어, English, 简体中文, 日本語 전환 시 문의 팝업과 모바일 카테고리 메뉴가 같은 언어로 표시된다.
- 완료 상태: `InquiryDialog`와 `CategoryOverlay`는 정적 번역 사전 기반으로 전환 완료. 추가 공개 컴포넌트의 하드코딩 문구는 후속 다국어 점검 대상이다.

### T-080 UI Placeholder 및 푸터 링크 사용성 보완

- GNB 상단의 장바구니, 최근 본 상품 버튼에 임시 동작을 추가한다.
- 아직 실제 기능이 없는 경우 "준비 중" 알림 또는 비활성 처리로 사용자 혼선을 줄인다.
- 홈/공개 푸터의 전화번호는 `tel:` 링크로, 홈페이지 주소는 정상 하이퍼링크로 연결한다.
- 완료 기준: 클릭 가능한 것처럼 보이는 UI가 무반응으로 남지 않는다.
- **완료 상태**: PC 탑 네비게이션 및 레거시 헤더의 미구현 버튼에 localized alert()를 연동했으며, 메인/이벤트 개별 푸터의 전화번호(`tel:`) 및 도메인 주소 링크를 활성화함과 동시에 고객센터/입점신청 내부 라우트를 유기적으로 추가 완성함. (2026-05-14)


### T-081 번역 운영 자동화 및 DB 캐시 아키텍처 설계

- 신규 DB 콘텐츠 추가 시 `static-translations` 수동 매핑이 누락되는 문제를 줄이는 장기 구조를 설계한다.
- AI 실시간 번역, 관리자 승인, `ContentTranslation` DB 캐시, 비용 제한, 개인정보 제외 정책을 함께 정의한다.
- 실제 AI API 호출은 별도 승인 전까지 구현하지 않는다.
- 완료 기준: 번역 생성, 검수, 캐시, 공개 노출까지의 운영 흐름이 문서화된다.

### T-082 공개 네비 `마이` 라우팅 분리

- 현재 공개 네비의 `마이`가 `/admin`으로 연결되는 문제를 수정한다.
- 관광객용 `/my` placeholder를 추가한다.
- `/admin`은 플랫폼 운영자 전용 경로로 유지한다.
- 완료 상태: 공개 PC/모바일 `마이` 링크를 `/my`로 변경했고, 비로그인 관광객용 `/my` placeholder를 추가했다.

### T-083 맞춤코스 빌더 MVP Lite

- 사용자가 숙박, 체험, 주민소득상품/음식 콘텐츠를 직접 조합할 수 있는 임시 코스 빌더를 만든다.
- 1차 저장은 localStorage 기반으로 처리한다.
- 결제, 예약 확정, 재고 확인은 포함하지 않는다.
- 완료 상태: `/course-builder`와 `/my/trips/new` redirect를 추가했고, DB published 콘텐츠 기반 선택/순서변경/localStorage 저장/문의 CTA를 구현했다.

### T-084 관광객 Auth 및 사용자 데이터 모델 설계

- 관광객 계정과 운영자 관리자 계정을 분리한다.
- `TouristUser`, `TouristProfile`, `SavedTripPlan`, `SavedTripPlanItem`, `UserNotification` 모델 후보를 검토한다.
- 완료 상태: `docs/24_TOURIST_AUTH_DATA_MODEL_SPEC.md`에 Auth 분리 원칙과 모델 초안을 문서화했다. 실제 Auth 구현과 Prisma migration은 후속 승인 대상으로 유지한다.

### T-085 관광객 대시보드 1차 구현

- `/my`에 맞춤코스, 찜 목록, 최근 본 콘텐츠, 예약현황 placeholder, 결제내역 placeholder, 알림 placeholder를 구성한다.
- Auth 도입 전에는 localStorage 기반으로 안전하게 제공한다.

### T-086 예약현황/결제내역 정책 결정

- 실제 예약/결제 도입 여부를 정책적으로 결정한다.
- 결정 전까지는 문의/외부 예약 연결 상태 수준으로만 표현한다.

### T-087 관광객 알림 센터 설계

- 문의 접수, 맞춤코스 저장, 이벤트/혜택, 운영자 답변 알림의 유형과 수신 동의 정책을 정의한다.

### T-088 홈 플로팅 페르소나·언어 재선택 배너

- 홈 화면 우측 하단에 첫 방문 온보딩 선택카드를 다시 열 수 있는 플로팅 배너를 추가한다.
- 초기 온보딩과 플로팅 배너 내부에서 한국어, English, 简体中文, 日本語를 직접 선택할 수 있게 한다.
- `usePersonaThemeStore`, `ltax_lang` cookie, localStorage 상태를 일관되게 동기화한다.
- 모바일에서는 하단 네비와 겹치지 않도록 배치하고, 관리자 화면에는 노출하지 않는다.
- 완료 기준: 홈에서 페르소나와 언어를 재선택할 수 있고, 새로고침 후 선택값이 유지된다.

### T-089 공개 전역 푸터 공통화 및 전체 페이지 적용

- 홈 화면에만 제한적으로 존재하는 푸터를 공개 전체 페이지에 공통 적용한다.
- `PublicNavigationShell` 또는 공개 route layout 레벨에서 `/admin`을 제외한 공개 화면에 동일 푸터를 노출한다.
- 기존 홈/이벤트 페이지 내부 푸터는 중복 노출되지 않도록 정리한다.
- 모바일 하단 네비와 겹치지 않도록 하단 여백을 보장한다.
- 완료 기준: `/`, 목록, 상세, 지도, 파트너, 고객센터, `/my`에서 푸터가 일관되게 보이고 `/admin`에는 노출되지 않는다.

## 11. 현재 판단

현재 코드는 빌드와 lint 기준으로는 정상이며, MVP 파일럿/내부 검증은 가능한 상태다.

다만 외부 공개 운영으로 전환하려면 P1/P2 항목을 먼저 정리해야 한다. 특히 공개 쓰기 API 방어, 관리자 인증 선검증, production query log 정리, `NEXT_PUBLIC_SITE_URL` 등록은 운영 안정성에 직접 영향을 준다.
