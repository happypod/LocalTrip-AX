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
- [ ] T-015 대시보드 실시간 데이터 집계 구현
- [ ] T-016 Region / BusinessProfile CRUD
- [ ] T-017 Accommodation CRUD
- [ ] T-018 Experience CRUD
- [ ] T-019 LocalIncomeProgram CRUD
- [ ] T-020 Course CRUD
- [ ] T-021 문의 / 입점신청 관리

## 6순위: 확장 기반
- [ ] T-022 교육·인증 구조
- [ ] T-023 AI 콘텐츠 도우미 Placeholder
- [ ] T-024 월간 성과 요약

## 7순위: 마감
- [ ] T-025 모바일 QA
- [ ] T-026 보안·환경변수
- [ ] T-027 배포
- [ ] T-028 MVP 릴리즈 노트
