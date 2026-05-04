# Project Tickets

## 1순위: 기본 골격

- [x] T-001 프로젝트 초기 세팅
- [ ] T-002 디자인 토큰
- [ ] T-003 Prisma Schema
- [ ] T-004 Seed Data

## 2순위: 전환 데이터 기반

- [ ] T-011 LeadEvent 기본 구조

## 3순위: 사용자 화면

- [ ] T-005 홈
- [ ] T-006 숙소
- [ ] T-007 체험
- [ ] T-008 주민소득상품
- [ ] T-009 추천 코스
- [ ] T-010 지도 placeholder

## 4순위: 문의와 입점신청

- [ ] T-012 문의폼
- [ ] T-013 입점신청

## 5순위: 관리자

- [ ] T-014 관리자 레이아웃
- [ ] T-015 대시보드
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

## Ticket Rules

- MVP는 예약 플랫폼이 아니라 문의·연결 중심 플랫폼이다.
- 결제, 정산, 실시간 예약, 차량운송, 후기, 쿠폰, 포인트는 MVP에서 제외한다.
- T-003 전에는 `Region`, `BusinessProfile`, `Accommodation`, `Experience`, `LocalIncomeProgram`, `Course`, `LeadEvent`, `Inquiry` 관계를 확정한다.
- `LocalIncomeProgram`은 `Experience`에 흡수하지 않는다.
- `LeadEvent`는 CTA 화면 구현 전에 기본 구조를 먼저 잡는다.
