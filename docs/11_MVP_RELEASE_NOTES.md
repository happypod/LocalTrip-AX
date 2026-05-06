# LocalTrip AX / 소원로컬트립 MVP Release Notes

## 1. 릴리즈 개요

- 프로젝트명: LocalTrip AX / 소원로컬트립 MVP
- 릴리즈 목적: 소원권역 숙소, 체험, 주민소득상품, 추천 코스, 문의, 입점신청, 교육·인증, 성과 요약을 연결하는 문의·연결 중심 MVP 공개
- Production URL: `https://localtrip-ax.vercel.app`
- 릴리즈 기준일: 2026-05-06
- 배포 기준: T-027 Vercel Production 배포 완료, T-028 릴리즈 문서 및 최종 smoke test 완료

## 2. MVP 포함 기능

- 공개 사용자 화면: 홈, 숙소, 체험, 주민소득상품, 추천 코스, 지도 placeholder, 문의/입점신청 진입
- 관리자 화면: 로그인, 대시보드, Region, BusinessProfile, 숙소, 체험, 주민소득상품, 코스, 문의, 입점신청, 교육·인증, 월간 성과 요약, AX 도우미 placeholder
- LeadEvent 수집: 전화, 카카오, 네이버예약, 홈페이지, 상세 클릭, 문의/입점신청 제출 흐름의 best-effort 기록
- 문의/입점신청: 개인정보 동의, 서버 유효성 검증, 저장 실패 시 실패 응답
- 교육·인증 관리: TrainingCourse, Certification 최소 CRUD 및 상태 관리
- 월간 성과 요약: 소원권역 기준 LeadEvent, 문의, 입점신청, 인기 콘텐츠 요약
- AX 도우미 Placeholder: 실제 AI API 호출 없이 Post-MVP 확장 방향만 시각화

## 3. MVP 제외 기능

- 결제, 정산, 예약 확정, 실시간 객실 재고
- 차량 운송, 배차, 셔틀 예약
- 후기 시스템, 쿠폰, 포인트
- 사용자 회원가입, 소셜 로그인, 사용자 마이페이지
- 실제 AI API 연동 및 AI 추천·생성 기능
- 실제 지도 API 연동
- 수강신청, 출석, QR/PDF 인증서 발급

## 4. 주요 화면

- `/`
- `/stays`
- `/stays/[slug]`
- `/experiences`
- `/experiences/[slug]`
- `/programs`
- `/programs/[slug]`
- `/courses`
- `/courses/[slug]`
- `/map`
- `/partner/apply`
- `/admin`
- `/admin/login`

## 5. 관리자 기능

- Region 관리
- BusinessProfile 관리
- Accommodation 관리
- Experience 관리
- LocalIncomeProgram 관리
- Course 및 CourseItem 관리
- Inquiry 관리
- PartnerApplication 관리
- TrainingCourse 관리
- Certification 관리
- 월간 Reports
- AX Assistant Placeholder

## 6. 데이터 모델 요약

- Region: 다지역 확장의 기준 권역 모델
- BusinessProfile: 숙소·체험·주민소득상품 운영자/사업자 프로필
- Accommodation: 숙소 독립 모델
- Experience: 일반 체험 독립 모델
- LocalIncomeProgram: 주민소득상품 독립 모델, `linkedLifeService`, `residentRole`, `revenueUse` 유지
- Course: 추천 코스 모델
- CourseItem: Course와 Accommodation, Experience, LocalIncomeProgram을 연결하는 다형성 연결 모델
- Inquiry: 관광객 문의 모델
- PartnerApplication: 입점신청 모델
- LeadEvent: CTA와 문의·입점신청 전환 기록 모델
- TrainingCourse: 교육과정 모델
- Certification: 인증항목 모델
- Event: 홈/이벤트 노출용 운영 콘텐츠 모델

## 7. 배포 및 환경변수

- Vercel scope: `sowons-projects-e525dae5`
- Vercel project: `localtrip-ax`
- Production URL: `https://localtrip-ax.vercel.app`
- Build command: `npm run build`
- Build script: `prisma generate && next build`

필수 환경변수:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

운영 주의사항:

- Production DB schema push와 seed는 T-027/T-028에서 실행하지 않았다.
- `npx prisma db push`, `npx prisma db seed`는 운영자 승인 후 별도 실행해야 한다.
- 운영 전 `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, DB credential rotation 여부를 확인한다.

## 8. QA 결과

로컬 검증:

- `npx prisma validate`: 통과
- `npm run lint`: 통과, 에러 0건
- `npm run build`: 통과

남은 warning:

- `src/components/experiences/experience-image.tsx`: `<img>` LCP 최적화 warning
- `src/components/stays/stay-image.tsx`: `<img>` LCP 최적화 warning

Production smoke test:

- `200 /`
- `200 /stays`
- `200 /stays/sowon-house-01`
- `200 /experiences`
- `200 /experiences/mallipo-sunset-walk`
- `200 /programs`
- `200 /programs/village-dining`
- `200 /courses`
- `200 /courses/sowon-one-day`
- `200 /map`
- `200 /partner/apply`
- `200 /admin`
- `200 /admin/login`
- `400 POST /api/inquiries` with empty body
- `400 POST /api/partner-applications` with empty body

## 9. Known Issues

- 이미지 컴포넌트 2곳은 `next/image`가 아닌 `<img>`를 사용해 LCP warning이 남아 있다.
- 접근성 전문 QA는 완료 항목으로 처리하지 않았다.
- 빈 상태, 이미지 fallback, 지도 fallback, draft/inactive 비노출 QA는 일부 체크리스트에 잔여 수동 확인 항목으로 남아 있다.
- Production DB schema push와 seed는 자동 실행하지 않았다.
- Vercel Preview 환경변수는 별도 non-production branch가 필요할 때 추가한다.
- AX 도우미와 지도는 placeholder이며 외부 API와 연결되어 있지 않다.

## 10. Post-MVP 권장 작업

- 실제 지도 API 연동 및 위치 데이터 정규화
- 실제 AI API 연동 및 비용/로그/승인 흐름 설계
- `next/image` 기반 이미지 최적화
- 접근성 QA 및 키보드 네비게이션 점검
- 운영 로그, 오류 모니터링, Vercel Observability 검토
- Prisma migration 전략 정리 및 운영 DB schema 적용 절차 확정
- 관리자 권한 세분화 및 audit log
- 공개 화면 draft/inactive 비노출 자동화 테스트
