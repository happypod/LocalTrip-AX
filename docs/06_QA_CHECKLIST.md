# QA Checklist

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
- [x] 최소 보안 헤더가 `next.config.ts`에 적용되어 있다

## T-027 Deployment QA

- [x] Vercel project linked: `sowons-projects-e525dae5/localtrip-ax`
- [x] Production env vars registered: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`
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
