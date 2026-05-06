# Project Tickets

## 1순위: 기본 골격
- [x] T-001 프로젝트 초기 세팅
- [x] T-002 디자인 토큰
- [x] T-003 Prisma Schema
- [x] T-004 Seed Data

## 2순위: 전환 데이터 기반
- [x] T-011 LeadEvent 기본 구조

## 3순위: 사용자 화면
- [x] T-005 홈
- [x] T-006 숙소
- [x] T-007 체험
- [x] T-008 주민소득상품
- [x] T-009 추천 코스
- [x] T-010 지도 placeholder

## 4순위: 문의와 입점신청
- [x] T-012 문의폼
- [x] T-013 입점신청 화면 구현
    - `/partner/apply` 화면 및 입점신청 저장 API 구현 완료
    - 신청자 유형 선택(8종) 및 상세 정보 입력 폼 구축
    - `PartnerApplication` 모델을 사용한 데이터 저장 (스키마 미보유 필드는 `message` 병합)
    - `LeadEvent` 연동 (`inquiry_submit`으로 기록)
    - T-012(관광객 문의)와 T-013(운영자 신청)의 UI/문구적 구분 명확화

## 5순위: 관리자
- [x] T-014 관리자 레이아웃 및 로그인 구조 구현
    - `/admin/login` 및 `/admin` 레이아웃 분리 완료
    - 환경변수 기반 세션 관리 (HTTP-only Cookie) 및 접근 보호 구현
    - 사이드바 메뉴(10종) 및 로그아웃 기능 구축
    - `AdminShell` 컴포넌트를 통한 서버 사이드 보호 체계 마련
- [x] T-015 대시보드 실시간 데이터 집계 구현
    - `/admin` 대시보드에서 소원권역 기준 콘텐츠, 문의, 입점신청, LeadEvent 요약 집계 구현
    - LeadEvent 인기 콘텐츠 및 최근 문의/입점신청 조회에 개인정보 마스킹/preview 적용
    - DB 조회 실패 시 대시보드 fallback 구조 유지
- [x] T-016 Region / BusinessProfile CRUD
    - `/admin/regions`, `/admin/businesses` 목록, 등록, 수정, 상태 변경 구현
    - 관리자 서버 액션 세션 검증 및 slug/status 서버 검증 적용
    - BusinessProfile과 Region 관계 검증 및 개인정보 마스킹 표시 적용
- [x] T-017 Accommodation CRUD
    - `/admin/stays` 목록, 등록, 수정, 상태 변경 구현
    - slug/status 서버 검증 및 BusinessProfile-Region 일치 검증 적용
    - 공개 숙소 화면과 `published` 상태 연동
- [x] T-018 Experience CRUD
    - `/admin/experiences` 목록, 등록, 수정, 상태 변경 구현
    - 관리자 서버 액션 세션 검증, slug/status 서버 검증, BusinessProfile-Region 일치 검증 적용
    - 공개 체험 화면과 `published` 상태 연동
- [x] T-019 LocalIncomeProgram CRUD
    - `/admin/programs` 관리자 목록, 등록, 수정 페이지 구현 완료
    - `actions.ts`에 관리자 세션 검증(`requireAdminSession`) 및 slug 유효성 검증 적용
    - 주민소득상품 전용 핵심 구조(생활서비스 연계, 주민 역할, 수익 활용) 필드 분리 관리 적용
- [x] T-020 Course CRUD
    - `/admin/courses` 관리자 목록, 등록, 수정 페이지 구현 완료
    - `actions.ts`에서 CourseItem의 다형성 검증(XOR), 상태 연계 로직 구현
    - 지역별 하위 콘텐츠 필터링 및 동적 항목 추가 폼 구축
- [x] T-021 문의 / 입점신청 관리
    - 일반 문의(Inquiry) 및 입점신청(PartnerApplication) 관리 목록, 상세 조회 구현 완료
    - 개인정보 보호를 위한 목록 내 이름, 전화번호, 이메일 마스킹 처리 (maskName, maskPhone, maskEmail)
    - 상태 값 검증 및 세션 보호(requireAdminSession)를 적용한 상태 변경 서버 액션(updateInquiryStatus, updatePartnerApplicationStatus) 구축
    - 소원(sowon) 권역 필터링 및 처리 완료 후 캐시 무효화(revalidatePath) 적용

## 6순위: 확장 기반
- [x] T-022 교육·인증 구조
    - `/admin/training` 경로 하위의 교육과정(`TrainingCourse`) 및 인증항목(`Certification`) 최소 CRUD 구조 구현 완료
    - 서버 액션에 `requireAdminSession` 보호 조치 적용 및 필수값(`title`, `regionId`), allowlist(`status`), region 존재 여부 서버 유효성 검증 체계 구현
    - 목록에서 원격 상태 실시간 갱신 및 캐시 무효화(`revalidatePath`)를 적용해 즉각 반영 구조 완비
- [x] T-023 AI 콘텐츠 도우미 Placeholder
    - `/admin/ai-assistant` 플레이스홀더 화면 구축 및 사이드바 `AX 도우미` 메뉴(Sparkles 아이콘) 연결 완료
    - Prisma를 연계해 소원권역 활성(Published) 상품 및 코스들의 개수를 안전하고 역동적으로 표기하는 읽기 전용 대시보드 구축
    - 상품 문안, 홍보 카피, 추천 코스, 운영 진단 등 핵심 4대 확장 카테고리를 직관적인 카드 형태로 배치 완료
- [x] T-024 월간 성과 요약
    - `/admin/reports` 월간 성과 요약 화면 구현 완료
    - `LeadEvent`, `Inquiry`, `PartnerApplication`을 `sowon` regionId와 선택 월 기준으로 집계
    - 이벤트 타입별 요약, 인기 콘텐츠 Top 10, 최근 전환 목록, published 콘텐츠 수 표시
    - 목록성 데이터에는 개인정보 원문 대신 마스킹/preview 적용



## 7순위: 마감
- [x] T-025 모바일 QA
    - 관리자 모바일 헤더 메뉴 버튼을 실제 오프캔버스 메뉴로 연결
    - 관리자 모바일 메뉴 및 메뉴 항목 터치 영역을 44px 이상으로 보정
    - 주민소득상품 CTA 버튼 크기를 모바일 기준 `xl`로 통일
    - 지도/입점/관리 문구의 `주민 프로그램` 표기를 `주민소득상품`으로 정리
- [x] T-026 보안·환경변수
    - `.env.example`에서 실제 secret처럼 보이는 값 제거 및 필수 환경변수 기준 정리
    - 관리자 Experience 서버 액션에 `requireAdminSession` 및 서버 입력 검증 추가
    - 문의/입점신청/LeadEvent API의 개인정보 동의, enum, 길이, 형식 검증 강화
    - `next.config.ts` 전역 최소 보안 헤더 적용
    - `docs/09_SECURITY_ENV.md` 보안·환경변수 운영 기준 문서 추가
- [x] T-027 배포
    - Vercel project `sowons-projects-e525dae5/localtrip-ax` 연결 완료
    - Production 환경변수 등록 완료: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`
    - `npm run build`에 `prisma generate`를 포함하여 Vercel fresh install 빌드 실패 방지
    - Production 배포 완료: `https://localtrip-ax.vercel.app`
    - 공개 목록/상세 주요 경로 및 문의/입점신청 API 기본 방어 smoke test 통과
- [x] T-028 MVP 릴리즈 노트
    - `docs/11_MVP_RELEASE_NOTES.md` 작성 완료
    - T-001~T-027 산출물과 Production 배포 상태 정리
    - MVP 포함/제외 범위, QA 결과, known issue, 운영 전 확인사항 문서화
