# 05_TICKETS.md

## Ticket Policy

각 티켓은 독립적으로 수행하되, T-001부터 순차 진행한다.

모든 티켓은 다음 항목을 포함해야 한다.

- 목적
- 작업 범위
- 제외 범위
- 수용 기준
- AntiGraffiti 권장 모델
- Codex 검토 항목

---

# Phase 0. 프로젝트 세팅

## T-001. 프로젝트 초기 세팅

### 목적

LocalTrip AX MVP 개발을 위한 기본 Next.js 프로젝트 구조를 만든다.

### 작업 범위

- Next.js App Router 프로젝트 구조 확인 또는 생성
- TypeScript 적용
- Tailwind CSS 적용
- shadcn/ui 적용
- 기본 layout 설정
- eslint, prettier 설정
- env 예시 파일 작성
- README 기본 작성

### 제외 범위

- DB 연결
- 인증
- 관리자 기능
- 지도 연동

### 수용 기준

- `npm run dev` 실행 가능
- `npm run build` 통과
- 모바일 기본 레이아웃 깨짐 없음
- 기본 홈 화면 출력

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 프로젝트 구조
- Next.js App Router 적합성
- Tailwind 설정
- 빌드 안정성

---

## T-002. 디자인 토큰 및 기본 UI 시스템

### 목적

MVP 전체에 적용할 기본 디자인 시스템을 만든다.

### 작업 범위

- 색상 토큰
- 버튼 스타일
- 카드 스타일
- 섹션 레이아웃
- 모바일 헤더
- 데스크톱 헤더
- 하단 푸터
- Badge 컴포넌트
- CTA 컴포넌트
- Empty State 컴포넌트

### 디자인 방향

- 공공사업 문서처럼 딱딱하지 않게
- OTA처럼 과하게 상업적이지 않게
- 로컬, 바다, 주민, 체류감이 느껴지는 톤
- 모바일 우선

### 수용 기준

- 공통 Button, Card, Badge, Section 컴포넌트 구현
- 홈 화면에서 디자인 토큰 적용 확인
- 375px 모바일 화면에서 깨짐 없음

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 컴포넌트 재사용성
- Tailwind class 일관성
- 모바일 가독성

---

# Phase 1. 데이터 구조

## T-003. Prisma Schema 1차 설계

### 목적

MVP에 필요한 핵심 DB 모델을 설계한다.

### 작업 범위

다음 모델 작성:

- Region
- BusinessProfile
- Accommodation
- Experience
- LocalIncomeProgram
- Course
- Inquiry
- LeadEvent
- TrainingCourse
- Certification

### 제외 범위

- 결제
- 정산
- 예약확정
- 후기
- 차량운송

### 수용 기준

- Prisma schema 작성 완료
- 관계 설정 완료
- regionId 기반 다지역 구조 반영
- migration 가능
- seed 데이터 작성 가능

### AntiGraffiti 권장 모델

- Gemini 3.1 Pro High

### Codex 검토 항목

- 모델 간 관계
- 확장 가능성
- 불필요한 복잡성 여부
- naming convention
- 향후 AX 데이터 활용 가능성

---

## T-004. Seed Data 작성

### 목적

MVP 화면 개발을 위한 소원권역 샘플 데이터를 작성한다.

### 작업 범위

- Region seed
- 숙소 8개
- 체험 6개
- 주민소득상품 5개
- 추천 코스 4개
- 교육과정 3개
- 인증배지 5개

### 수용 기준

- seed 실행 가능
- 홈, 목록, 상세 화면에서 샘플 데이터 표시 가능
- 실제 데이터와 혼동되지 않도록 샘플 표시 또는 mock 명시

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 데이터 현실성
- 소원권역 맥락 반영 여부
- 필드 누락 여부

---

# Phase 2. Public User Pages

## T-005. 사용자 홈 화면 구현

### 목적

소원로컬트립 MVP의 첫 화면을 구현한다.

### 작업 범위

- Hero
- 추천 숙소
- 추천 체험
- 주민소득상품 섹션
- 추천 코스
- 지역 소개
- 입점문의 CTA
- 플랫폼 설명

### 핵심 문구

- 숙박만 고르는 여행이 아니라, 지역의 하루를 고르는 플랫폼
- 주민이 운영하는 로컬체류여행
- 소원권역의 숙박·체험·로컬상품을 한곳에서 연결

### 수용 기준

- 모바일 우선 화면 구성
- 주요 CTA 동작
- seed 데이터 기반 추천 카드 표시
- 로딩/빈 상태 처리

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 메시지 명확성
- UX 흐름
- CTA 위치
- 모바일 가독성

---

## T-006. 숙소 목록 및 상세 화면

### 목적

숙소를 목록과 상세로 보여준다.

### 작업 범위

- /stays
- /stays/[slug]
- 카드형 목록
- 지역 필터
- 태그 필터
- 상세 정보
- 전화/카카오/네이버예약/홈페이지 CTA
- LeadEvent 기록

### 수용 기준

- 숙소 목록 표시
- 상세 페이지 이동
- CTA 클릭 시 LeadEvent 생성
- 모바일에서 이미지와 정보가 안정적으로 보임

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- CTA 추적 정확성
- 데이터 null 처리
- 필터 UX
- 상세정보 과밀 여부

---

## T-007. 체험 목록 및 상세 화면

### 목적

로컬체험을 목록과 상세로 보여준다.

### 작업 범위

- /experiences
- /experiences/[slug]
- 카테고리 필터
- 태그 필터
- 가격·시간·인원 표시
- 안전안내
- 문의 CTA
- LeadEvent 기록

### 수용 기준

- 체험 목록 표시
- 상세 이동
- 문의 CTA 동작
- 안전안내 필드 표시
- LeadEvent 기록

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 체험 정보 구조
- 가족/안전 문구
- UX 명확성

---

## T-008. 주민소득상품 목록 및 상세 화면

### 목적

생활서비스 연계형 주민소득상품을 별도 카테고리로 보여준다.

### 작업 범위

- /programs
- /programs/[slug]
- 연결 생활서비스 표시
- 주민 역할 표시
- 수익 환류 설명 표시
- 문의 CTA
- LeadEvent 기록

### 수용 기준

- 주민소득상품이 숙소·체험과 구분되어 보임
- 생활서비스 연계성이 설명됨
- 상품 상세에서 주민참여 구조가 드러남
- 문의 가능

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 일반 관광상품처럼 보이지 않는지
- 생활서비스 연계 설명이 충분한지
- 정책성과 사업성이 균형인지

---

## T-009. 추천 코스 목록 및 상세 화면

### 목적

숙박·체험·로컬상품을 묶은 추천 코스를 보여준다.

### 작업 범위

- /courses
- /courses/[slug]
- 가족형, 커플형, ESG형, 어촌형 필터
- 일정표 표시
- 추천 숙소 연결
- 추천 체험 연결
- 문의 CTA

### 수용 기준

- 코스 목록 표시
- 상세 일정 표시
- 관련 숙소·체험 링크 연결
- 모바일에서 일정표 가독성 확보

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 코스 구조 현실성
- 이동 부담 최소화 여부
- 상품 연결 구조

---

## T-010. 지도 탐색 화면 1차 구현

### 목적

숙소·체험·주민소득상품의 위치를 지도 또는 지도형 UI로 보여준다.

### 작업 범위

- /map
- 지도 API 연동 또는 MVP placeholder
- 카드 리스트와 지도 포인트 동시 표시
- 카테고리 토글
- 위치 클릭 시 상세 이동

### 수용 기준

- 지도 또는 지도형 UI 표시
- 숙소/체험/프로그램 구분
- 모바일에서 지도와 목록 전환 가능
- API Key가 없어도 fallback UI 동작

### AntiGraffiti 권장 모델

- Gemini 3.1 Pro High

### Codex 검토 항목

- 지도 연동 안정성
- API Key 보안
- fallback 처리
- 모바일 UX

---

# Phase 3. Inquiry / Lead / Partner

## T-011. LeadEvent 추적 API 구현

### 목적

조회, 전화클릭, 카카오클릭, 예약링크 클릭 등 사용자 행동을 기록한다.

### 작업 범위

- LeadEvent create API
- 공통 tracking 함수
- CTA 컴포넌트에 이벤트 연결
- 관리자 통계에서 사용 가능하도록 구조화

### actionType

- view
- phone_click
- kakao_click
- naver_booking_click
- homepage_click
- inquiry_submit
- map_click
- share_click

### 수용 기준

- CTA 클릭 시 LeadEvent 저장
- itemType, itemId, regionId 저장
- 오류 발생 시 사용자 경험 방해하지 않음

### AntiGraffiti 권장 모델

- Gemini 3.1 Pro High

### Codex 검토 항목

- 데이터 누락 가능성
- API 안정성
- 개인정보 미수집 원칙
- 향후 AX 분석 활용성

---

## T-012. 문의폼 구현

### 목적

사용자가 숙소·체험·주민소득상품에 문의할 수 있게 한다.

### 작업 범위

- 공통 Inquiry Form
- 상품별 문의 연결
- 이름, 연락처, 희망일, 인원, 메시지
- 개인정보 동의 체크
- 관리자 문의 목록에 표시

### 수용 기준

- 문의 제출 가능
- 상품과 연결 저장
- 제출 후 완료 메시지
- 관리자에서 확인 가능

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 개인정보 최소 수집
- 동의 문구
- 스팸 방지 기본 구조
- 모바일 폼 UX

---

## T-013. 입점신청 화면 구현

### 목적

숙소주, 체험운영자, 주민사업체가 플랫폼 입점을 신청할 수 있게 한다.

### 작업 범위

- /partner/apply
- 신청자 유형 선택
- 업체명
- 담당자명
- 연락처
- 지역
- 상품 아이디어
- 기존 홈페이지/네이버예약 링크
- 관리자 검토 상태

### 수용 기준

- 입점신청 제출 가능
- 관리자에서 목록 확인 가능
- 상태 변경 가능
- 신청 완료 메시지 표시

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 입력항목 적절성
- 주민사업체 신청 흐름
- 후속 영업 활용성

---

# Phase 4. Admin

## T-014. 관리자 레이아웃 및 로그인 구조

### 목적

MVP 관리자 화면의 기본 구조를 만든다.

### 작업 범위

- /admin
- 관리자 레이아웃
- 사이드바
- 상단바
- 임시 로그인 또는 기존 인증 구조 연결
- 권한 보호 기본 처리

### 수용 기준

- 관리자 화면 접근 가능
- 비인가 접근 제한
- 메뉴 이동 가능
- 모바일 최소 대응

### AntiGraffiti 권장 모델

- Gemini 3.1 Pro High

### Codex 검토 항목

- 인증 구조
- 보안 리스크
- 권한 확장성
- 관리자 UX

---

## T-015. 관리자 대시보드

### 목적

플랫폼 운영 현황을 한눈에 확인할 수 있는 대시보드를 만든다.

### 작업 범위

- 숙소 수
- 체험 수
- 주민소득상품 수
- 문의 수
- 입점신청 수
- LeadEvent 요약
- 인기 상품 Top 5
- 최근 문의
- 최근 입점신청

### 수용 기준

- 실제 DB 기반 집계
- 빈 데이터 처리
- 최근 데이터 표시
- 모바일/태블릿에서 깨짐 없음

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 집계 쿼리 효율
- 정보 우선순위
- 운영자가 바로 이해 가능한지

---

## T-016. Region / BusinessProfile 관리자 CRUD

### 목적

지역과 사업자 프로필을 관리한다.

### 작업 범위

- Region 목록/생성/수정/비공개
- BusinessProfile 목록/생성/수정/상태관리
- regionId 연결
- 사업자 유형 관리

### 수용 기준

- CRUD 동작
- 상태값 관리
- region 연결 가능
- 삭제보다 비공개 또는 inactive 처리 우선

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 다지역 확장성
- 사업자 유형 구조
- 삭제 정책

---

## T-017. Accommodation 관리자 CRUD

### 목적

숙소 정보를 관리한다.

### 작업 범위

- 숙소 목록
- 숙소 생성
- 숙소 수정
- 숙소 노출/비노출
- 이미지 URL 입력
- 태그 입력
- CTA 링크 입력

### 수용 기준

- 관리자에서 숙소 등록 가능
- 사용자 화면에 반영
- 필수값 검증
- 상태값 처리

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 숙소 필드 적절성
- null 처리
- 사용자 화면 반영 여부

---

## T-018. Experience 관리자 CRUD

### 목적

체험 정보를 관리한다.

### 작업 범위

- 체험 목록
- 체험 생성
- 체험 수정
- 카테고리
- 가격
- 인원
- 안전안내
- 문의링크
- 노출상태

### 수용 기준

- 체험 등록 가능
- 사용자 화면 반영
- 안전안내 필드 필수 또는 권장 처리
- 상태값 처리

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 체험 운영 정보 누락 여부
- 안전정보 표현
- 가격/인원 구조

---

## T-019. LocalIncomeProgram 관리자 CRUD

### 목적

생활서비스 연계형 주민소득상품을 관리한다.

### 작업 범위

- 프로그램 목록
- 생성
- 수정
- 연결 생활서비스
- 주민 역할
- 수익 환류 설명
- 가격
- 운영정보
- 노출상태

### 수용 기준

- 주민소득상품 등록 가능
- 사용자 화면 반영
- 생활서비스 연계 필드 표시
- 수익 환류 설명 표시

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 유형2 정책 문맥과 충돌 없는지
- 일반 관광상품처럼 보이지 않는지
- 주민소득 구조 표현

---

## T-020. Course 관리자 CRUD

### 목적

추천 코스를 관리한다.

### 작업 범위

- 코스 목록
- 생성
- 수정
- targetType
- durationType
- routeItems
- 관련 숙소/체험/프로그램 연결
- 노출상태

### 수용 기준

- 코스 등록 가능
- 사용자 화면 반영
- routeItems 표시 가능
- 관련 상품 링크 연결

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- routeItems 구조
- 연결 상품 구조
- 향후 패키지 빌더 확장성

---

## T-021. Inquiry / Partner Application 관리자 관리

### 목적

문의와 입점신청을 관리한다.

### 작업 범위

- 문의 목록
- 문의 상세
- 상태 변경
- 입점신청 목록
- 입점신청 상세
- 상태 변경
- 메모 필드

### 수용 기준

- 문의 확인 가능
- 입점신청 확인 가능
- 상태값 변경 가능
- 최근순 정렬

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 운영 실무 활용성
- 상태값 정의
- 개인정보 노출 범위

---

# Phase 5. Education / Certification Base

## T-022. 교육과정 및 인증배지 기본 구조

### 목적

MVP 이후 주민사업체 육성 기능으로 확장할 수 있는 기본 구조를 만든다.

### 작업 범위

- TrainingCourse 관리자 목록
- TrainingCourse 생성/수정
- Certification 관리자 목록
- 사업자별 인증배지 부여
- 사용자 상세 페이지에 인증배지 표시

### 수용 기준

- 교육과정 등록 가능
- 인증배지 등록 가능
- 숙소/체험/프로그램 상세에 배지 표시 가능
- 수료증 발급은 MVP 제외

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- 교육·인증 확장성
- 주민사업체 육성 구조 반영 여부
- 향후 수료증 기능 연결성

---

# Phase 6. AX Ready

## T-023. AI 콘텐츠 도우미 Placeholder

### 목적

향후 AX 기능을 붙일 수 있는 화면과 데이터 구조를 마련한다.

### 작업 범위

- 관리자 내 AI Draft Helper 화면
- 상품명, 설명, 대상, 운영정보 입력
- 현재는 API 호출 없이 프롬프트 생성 또는 mock output
- 향후 LLM API 연동 가능한 service layer 분리

### 기능 예시

- 상품 상세페이지 초안 생성
- SNS 홍보문안 초안 생성
- 안전안내 초안 생성
- 주민교육 문구 초안 생성

### 수용 기준

- 관리자에서 AI 도우미 화면 접근 가능
- 입력값 기반 프롬프트 생성 가능
- mock 결과 표시 가능
- 실제 AI API Key 없이 빌드 가능

### AntiGraffiti 권장 모델

- Gemini 3.1 Pro High

### Codex 검토 항목

- API 확장 구조
- 프롬프트 품질
- 개인정보 입력 방지
- 향후 LLM 연동성

---

## T-024. 월간 성과 요약 리포트 기본 화면

### 목적

공공사업 및 운영관리용 성과 요약 화면을 만든다.

### 작업 범위

- 월별 LeadEvent 집계
- 문의 수
- 인기 상품
- 상품별 클릭 수
- 주민소득상품 반응
- 간단한 요약 문장
- PDF export는 MVP 이후

### 수용 기준

- 관리자에서 월간 성과 확인 가능
- 상품별 반응 비교 가능
- 빈 상태 처리
- 향후 AI 리포트 자동작성 연결 가능

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- KPI 적절성
- AX 분석 확장성
- 공공사업 보고 활용성

---

# Phase 7. QA / Deploy

## T-025. 모바일 반응형 QA

### 목적

MVP 전체 화면의 모바일 사용성을 점검한다.

### 작업 범위

- 375px
- 390px
- 430px
- 768px
- 데스크톱
- 홈
- 목록
- 상세
- 지도
- 문의폼
- 관리자

### 수용 기준

- 가로스크롤 없음
- CTA 클릭 가능
- 이미지 비율 안정
- 폼 입력 가능
- 관리자 최소 사용 가능

### AntiGraffiti 권장 모델

- Claude Sonnet 4.6 Thinking

### Codex 검토 항목

- 모바일 UX
- CTA 가독성
- 정보 과밀
- 접근성

---

## T-026. 보안·환경변수 점검

### 목적

배포 전 환경변수와 보안 기본값을 점검한다.

### 작업 범위

- .env.example
- DB URL
- API Key 관리
- 지도 API Key
- 관리자 인증
- 개인정보 수집 폼
- robots, sitemap 기초

### 수용 기준

- 민감정보 코드에 하드코딩 없음
- .env.example 제공
- 관리자 접근 보호
- 개인정보 동의 문구 표시

### AntiGraffiti 권장 모델

- Gemini 3.1 Pro High

### Codex 검토 항목

- 보안 리스크
- 개인정보 수집 최소화
- 배포환경 적합성

---

## T-027. 빌드 및 배포

### 목적

Vercel 기준 배포를 완료한다.

### 작업 범위

- build 통과
- Prisma generate 확인
- migration 확인
- seed 적용
- Vercel 환경변수 설정
- 배포 URL 확인

### 수용 기준

- production 배포 접속 가능
- 주요 화면 정상
- 관리자 접속 가능
- API 오류 없음

### AntiGraffiti 권장 모델

- Claude Sonnet 4.6 Thinking

### Codex 검토 항목

- 배포 로그
- Prisma/Vercel 이슈
- 환경변수
- 런타임 오류

---

## T-028. MVP 최종 QA 및 릴리즈 노트

### 목적

MVP 1차 버전을 마감한다.

### 작업 범위

- 전체 기능 테스트
- known issues 정리
- 릴리즈 노트 작성
- 다음 Phase backlog 정리
- 운영자 사용 가이드 작성

### 수용 기준

- QA 체크리스트 완료
- 중대 오류 없음
- 운영자 가이드 작성
- 다음 개발 티켓 정리

### AntiGraffiti 권장 모델

- Gemini 3 Flash

### Codex 검토 항목

- MVP 완성도
- 운영 가능성
- 다음 단계 우선순위