# QA Checklist

## DB Source of Truth QA

- [x] 공개 `/`, `/stays`, `/experiences`, `/programs`, `/courses`, `/map` 화면에서 runtime fallback 데이터 병합 제거
- [x] 공개 목록/상세 조회는 `sowon` region 및 `status = published` 기준으로 통일
- [x] Neon DB schema push 완료
- [x] `prisma/seed.ts` 실행 완료: 숙소 4, 체험 4, 주민소득상품 11, 코스 7
- [x] 관리자 코스 등록 개수와 공개 코스 개수가 DB 기준으로 일치하도록 seed 보강
- [x] `npm run lint` 통과
- [x] `npm run build` 통과

- [ ] T-001 Project Setup Build Check
- [x] Responsive Layout Check
- [ ] Accessibility Check

## Public QA

- [x] 모바일 CTA 터치 영역 44px 이상 확인
- [x] 개인정보 동의 체크 전 문의/입점신청 제출 차단
- [ ] 빈 상태 화면 확인
- [ ] 이미지 fallback 확인
- [ ] 지도 fallback 확인
- [x] LeadEvent 실패 시 사용자 CTA 흐름 유지
- [ ] 공개 화면에는 `status=published`만 노출
- [ ] `draft`, `inactive` 데이터 비노출

## Admin QA

- [x] 관리자 접근 보호 확인
- [x] 관리자 표 모바일 overflow 확인
- [ ] 문의/입점신청 목록 개인정보 마스킹 확인

## T-024 Monthly Reports QA

- [ ] `/admin/reports` 접근 보호 확인
- [ ] 월 필터가 `YYYY-MM` query string으로 동작
- [ ] 잘못된 month 값은 현재 월로 fallback
- [ ] 모든 집계가 `sowon` regionId로 제한
- [ ] LeadEvent 타입별 집계 확인
- [ ] 인기 콘텐츠 Top 10에서 `local_income_program` 제목 resolve 확인
- [ ] 최근 문의/입점신청 목록 개인정보 마스킹 확인
- [ ] 선택 월 데이터가 없을 때 빈 상태 확인

## T-025 Mobile QA

- [x] 관리자 모바일 헤더의 메뉴 버튼이 실제 메뉴 패널을 연다
- [x] 관리자 모바일 메뉴 버튼과 메뉴 항목 터치 영역이 44px 이상이다
- [x] 관리자 목록 테이블이 모바일에서 가로 스크롤 컨테이너 안에 유지된다
- [x] 공개 주민소득상품 CTA 버튼이 `xl` 크기 기준으로 렌더링된다
- [x] 지도/입점/관리 문구에서 `주민소득상품` 명칭을 일관되게 사용한다

## T-026 Security & Environment QA

- [x] `.env.example`에는 실제 secret처럼 보이는 값이 없다
- [x] `.env*`는 gitignore되고 `.env.example`만 예외로 포함된다
- [x] 관리자 mutation Server Action은 `requireAdminSession()`을 직접 호출한다
- [x] 문의/입점신청 API는 개인정보 동의가 없으면 저장하지 않는다
- [x] 문의/입점신청 API는 저장 실패를 성공으로 응답하지 않는다
- [x] LeadEvent 저장 실패는 사용자 흐름을 막지 않는다

## T-059 Operational Monitoring QA

- [x] API 실패 시 사용자 메시지가 안전하게 노출되는가 (DB 스키마, 스택 트레이스 노출 방지)
- [x] 운영 로그(Vercel Logs)에 이름, 이메일, 연락처 등 개인정보가 원문으로 남지 않는가
- [x] LeadEvent 실패 시 CTA 이동이 막히지 않는가 (200 OK Best-effort)
- [x] 문의 저장 실패 시 내부 로그가 에러로 남고, 사용자는 실패 응답(500/503 등)을 받는가
- [x] 입점신청 저장 실패 시 내부 로그가 에러로 남고, 사용자는 실패 응답을 받는가
- [x] Vercel Production Logs 확인 절차가 문서화되어 있는가 (`17_OPERATION_MONITORING.md`)
- [x] 최소 보안 헤더가 `next.config.ts`에 적용되어 있다

## T-060 AI Integration Planning QA

- [x] AI 실제 호출은 기본 비활성 상태로 문서화되어 있는가 (`AI_FEATURES_ENABLED=false`)
- [x] AI API key가 브라우저에 노출되지 않는 server-only secret으로 정의되어 있는가
- [x] provider, model, 비용 상한, 호출 제한, 입력/출력 길이 제한 기준이 문서화되어 있는가
- [x] 관리자 승인 전 AI 결과를 자동 저장·자동 공개하지 않는 workflow가 문서화되어 있는가
- [x] 문의자명, 연락처, 이메일, 입점신청 원문 등 개인정보를 AI provider로 전송하지 않는 기준이 문서화되어 있는가
- [x] AI 요청 로그에서 full prompt, full completion, secret, 개인정보를 남기지 않는 기준이 문서화되어 있는가
- [x] T-060에서는 신규 AI SDK 설치 및 실제 API 호출 코드가 추가되지 않았는가

## T-027 Deployment QA

- [x] Vercel project linked: `sowons-projects-e525dae5/localtrip-ax`
- [x] Production env vars registered: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
- [ ] T-039 recheck: add `NEXT_PUBLIC_SITE_URL` to Vercel Production before final public launch
- [x] `npx prisma validate` passed before deployment
- [x] `npm run lint` passed with existing `<img>` LCP warnings only
- [x] `npm run build` passed locally with `prisma generate && next build`
- [x] Vercel Production build passed and aliased to `https://localtrip-ax.vercel.app`
- [x] Public smoke paths returned 200: `/`, `/stays`, `/experiences`, `/programs`, `/courses`, `/map`, `/partner/apply`
- [x] Detail smoke paths returned 200: `/stays/sowon-house-01`, `/experiences/mallipo-sunset-walk`, `/programs/village-dining`, `/courses/sowon-one-day`
- [x] Empty POST validation returned 400: `/api/inquiries`, `/api/partner-applications`
- [ ] Production DB schema push and seed are not executed automatically; run only after explicit operator approval.

## T-028 Release QA

- [x] Production URL 접속 확인: `https://localtrip-ax.vercel.app`
- [x] 공개 주요 화면 HTTP 200 확인: `/`, `/stays`, `/experiences`, `/programs`, `/courses`, `/map`, `/partner/apply`
- [x] 공개 상세 화면 HTTP 200 확인: `/stays/sowon-house-01`, `/experiences/mallipo-sunset-walk`, `/programs/village-dining`, `/courses/sowon-one-day`
- [x] 관리자 진입 화면 접근 확인: `/admin`, `/admin/login`
- [x] 문의/입점신청 API 빈 body validation 확인: `400`
- [x] `npx prisma validate` 통과
- [x] `npm run lint` 통과: 에러 0건, `<img>` LCP warning 2건
- [x] `npm run build` 통과
- [x] `docs/11_MVP_RELEASE_NOTES.md` 작성
- [x] Production 재배포, Vercel 환경변수 변경, DB push, DB seed 미실행

## T-033 Mobile/PC Viewport QA

- [x] Desktop (1440x900) 랜딩 페이지 레이아웃 확인
- [x] Mobile (390x844) 랜딩 페이지 bottom nav, top bar 확인
- [x] 주요 9개 공개 라우트 Content Landmarks (Header/Nav/Size) 확인 완료
- [x] 비로그인 접근 `/admin` 시 `/admin/login` 리다이렉트 (307) 로직 보완 및 검증 완료
- [x] `npm run lint` 에러 없음 확인 (기존 <img> warning 제외)
- [x] `npm run build` 통과 확인
- [x] Production UI 치명적 깨짐(P1/P2) 미발견
- [ ] 실제 iOS/Android/PC 기기 수동 확인은 후속 QA에서 별도 수행

## T-034 Public Data Exposure QA

- [x] 공개 라우트 Prisma Query `{ status: "published" }` 조건 전수 검증
- [x] Course 상세 연결 항목에 대한 Non-published JS 필터링 렌더 방지 로직 검증 완료 (`src/app/courses/[slug]/page.tsx`)
- [x] 개인정보(문의/입점신청) READ API 공개 노출 없음 확인 (Admin 한정 로직)
- [x] CTA 정책 준수 확인 (외부 연결 및 단순 조회형 Flow 유지)
- [x] Production URL Live HEAD Verification Success (200 OK)
- [x] 빈 상태(/events 등) 시 Fallback 레이아웃 안정성 확인

## Event Operating Content Follow-up

- [x] Event 모델에 `regionId` 및 `Region` relation 추가
- [x] Event 모델에 `@@index([regionId, status])` 추가
- [x] `/events` 페이지가 fallback이 아니라 실제 Event 데이터를 조회하도록 전환
- [x] Home 이벤트 조회에 `regionId + status=published` 필터 적용
- [x] draft/inactive 및 다른 region 이벤트 비노출 정책 반영
- [x] 이벤트 없음 상태 UI 확인

## T-070 Event Admin CRUD Region QA

- [x] 이벤트 생성/수정/상태 변경/삭제 Server Action이 `requireAdminSession()`을 직접 호출한다
- [x] 이벤트 수정/상태 변경/삭제 전 대상 Event가 `sowon` region에 속하는지 서버에서 재검증한다
- [x] `tag`, `title`, `subTitle`, `description`은 서버에서 trim 후 빈 값 저장을 거부한다
- [x] `status`는 `draft`, `published`, `inactive` allowlist만 허용한다
- [x] `href`는 허용된 내부 운영 경로 allowlist만 저장한다
- [x] `gradient`는 관리자 UI와 서버 allowlist가 같은 값 집합을 사용한다
- [x] 이벤트 변경 후 `/admin/events`, `/events`, `/` 경로를 revalidate한다

## T-035 개인정보/문의/입점신청 QA

- [x] 문의/입점신청 공개 폼 개인정보 수집 최소화 및 동의 Checkbox UI 정상
- [x] 필수값 또는 개인정보 동의 누락 시 API단에서 방어(HTTP 400 응답)
- [x] 정상 요청 시 `200 OK`, DB 저장 에러 시 명확한 실패 응답(`500 INTERNAL_SERVER_ERROR`) - 실패를 성공으로 무마(ok: true)하는 P1 취약점 없음
- [x] 부가적 로깅 이벤트(LeadEvent) 적재 실패는 본 작업 성공 응답에 영향을 미치지 않음 (Best-effort 준수)
- [x] 관리자 문의/입점신청 목록 컴포넌트(`inquiry-list.tsx` 등)에서 이름, 이메일, 전화번호 마스킹 처리 확인 (`maskName`, `maskEmail`, `maskPhone`)
- [x] 관리자 목록 데이터 전달 시 `message` 원문을 누락시키고 Server Side에서 잘라낸 `messagePreview` 속성만 전송함으로써 근본적인 데이터 노출 사전 차단 확인
- [x] 상세 원문 페이지는 인가된 관리자만 접근 가능하며(`requireAdminSession` 적용), 소원권역(`sowon`)으로 데이터 조회 스코핑 한정 완료

## T-036 이미지 및 Fallback QA

- [x] 외부 Placeholder 서비스(`placehold.co`, `unsplash` 등) 의존성 검색 결과 전무함 확인
- [x] 이미지 누락 시 로컬 Placeholder UI("이미지 준비 중") 표시 로직 전수 점검 완료 (`content-card.tsx`, `stay-image.tsx`, `experience-image.tsx`, `program-image.tsx`, `course-image.tsx`, `map-item-card.tsx`, `event-slider.tsx`)
- [x] `onError` 발생 시 Javascript State를 통한 Fallback 트리거링 구조 정상 동작 확인
- [x] Data Mapping 단계에서 이미지 배열의 첫 요소(`images?.[0]`)에 대한 안전한 Optional Chaining 접근 검증
- [x] Production UI 전체 빌드 테스트(`npm run build`) 통과 확인 및 렌더링 안전성 확보
- [x] <img> 사용에 따른 LCP Warning(Next/Image 미사용)은 이미 인지된 성능적 개선사항(Post-MVP)으로 인계 처리

## T-037 지도 Placeholder QA

- [x] `/map` 경로 Live Production 200 OK 정상 응답 확인
- [x] 지도 API Key 미연동 상태에서도 안내 텍스트(Info)와 Static Placeholder를 통해 안정적인 레이아웃 제공
- [x] Database 쿼리(`prisma.accommodation.findMany` 등)에서 `regionId: sowonRegion.id` 및 `status: "published"` 필터링 전수 적용 검증
- [x] Map Item Card에서 카테고리별 고유 Label("주민소득상품" 등) 및 고유 Tailwind Color/Icon 분리 표시 확인
- [x] 이미지 부재 시 `ImageOff` Lucide 아이콘과 "이미지 준비 중" 로컬 UI 처리 완료
- [x] 이벤트 로깅(`trackLeadEvent`)의 `catch` 무결 및 `keepalive: true`를 통한 사용자 인터랙션(클릭) 비지연(Non-blocking) 설계 보장

## T-039 운영 도메인 QA

- [x] Vercel 기본 Production URL 유지 결정: `https://localtrip-ax.vercel.app`
- [x] Production 공개 경로 HTTP 확인: `/`, `/stays`, `/experiences`, `/programs`, `/courses`, `/map`, `/partner/apply`, `/customer-center` 모두 `200 OK`
- [x] `/admin` 비로그인 접근 시 `/admin/login`으로 `307 Temporary Redirect` 확인
- [x] 커스텀 도메인은 외부 공개/홍보 전 연결 권장으로 문서화
- [x] Vercel DNS 연결 절차 문서화
- [ ] Vercel Production에 `NEXT_PUBLIC_SITE_URL` 추가 필요

## T-040 출시 승인 체크리스트 QA

- [x] `docs/12_PRE_LAUNCH_CHECKLIST.md` 작성 및 출시 판단 포함
- [x] MVP 범위 준수 항목 확인
- [x] 공개 화면/관리자 화면/DB/환경변수/보안/LeadEvent/Known Issues 항목 포함
- [x] 현재 출시 판단: 조건부 출시 승인
- [x] `npx prisma validate` 통과
- [x] `npm run lint` 통과: 에러 0건, 기존 `<img>` LCP warning 2건
- [x] `npm run build` 통과
- [ ] 조건부 승인 잔여 항목: `NEXT_PUBLIC_SITE_URL` Production 등록, 실제 기기 QA, 커스텀 도메인 연결 시점 결정

## T-038 접근성 기본 QA

- [x] 모바일 하단 네비게이션 아이콘 버튼에 `aria-label`, `title`, `aria-current` 적용 상태 확인
- [x] 모바일 카테고리 오버레이의 검색 input에 명시적인 `aria-label` 보완 완료
- [x] 관리자 사이드바 접힘 상태(icon-only) 링크에 `aria-label` 및 `title`을 통한 툴팁/스크린리더 설명 제공 확인
- [x] 문의 다이얼로그(`inquiry-dialog.tsx`)의 모든 Form Controls(Input, Textarea, Checkbox)가 `htmlFor`/`id` 및 Radix `Label`로 올바르게 연결됨을 보장
- [x] 입점 신청 폼(`partner-apply-form.tsx`)의 신청자 유형 선택용 div 요소를 시맨틱 `<button>`으로 리팩토링하여 키보드 Focus 접근성 및 선택 상태(`aria-pressed`) 식별력 개선 완료
- [x] 관리자 로그인 페이지 Input ID/Label 매칭 무결성 확인

## T-057 Persona Theme / i18n QA

- [x] 페르소나 테마 전환 시 UI 정상 반영 확인 (Local Storage 유지, Hydration 이상 없음)
- [x] 4개 언어(ko, en, zh-cn, ja-jp) Dictionary 정상 교체 및 에러(Missing Key) 없음 확인
- [x] 공개 상세 화면 접속 시 `ltax_lang` 쿠키 기반 SSR 번역 Fallback (선택 언어 -> 영어 -> 원문) 정상 확인
- [x] 관리자 다국어 번역 UI의 "AI 번역 초안 준비" 버튼 Placeholder 정상 노출 (API 실제 호출 없음)
- [x] 모바일 네비게이션과 테마/언어 UI 간 레이아웃 충돌 없음 확인
