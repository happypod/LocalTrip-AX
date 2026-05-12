# 06_QA_CHECKLIST.md

## 공통 QA

- [ ] npm run build 통과
- [ ] TypeScript 오류 없음
- [ ] 모바일 가로스크롤 없음
- [ ] 주요 CTA 클릭 가능
- [ ] 로딩 상태 표시
- [ ] 빈 데이터 상태 표시
- [ ] 이미지 깨짐 대응
- [ ] 잘못된 slug 접근 시 404 또는 fallback 처리
- [ ] 환경변수 누락 시 오류 메시지 명확
- [ ] 콘솔 에러 없음

---

## 사용자 화면 QA

### Home

- [ ] Hero 문구 표시
- [ ] 추천 숙소 표시
- [ ] 추천 체험 표시
- [ ] 주민소득상품 표시
- [ ] 추천 코스 표시
- [ ] CTA 정상 이동

### 숙소

- [ ] 목록 표시
- [ ] 필터 동작
- [ ] 상세 이동
- [ ] 전화 클릭 동작
- [ ] 카카오 클릭 동작
- [ ] 네이버예약 클릭 동작
- [ ] LeadEvent 기록

### 체험

- [ ] 목록 표시
- [ ] 카테고리 필터
- [ ] 상세 이동
- [ ] 가격·시간·인원 표시
- [ ] 안전안내 표시
- [ ] 문의 동작

### 주민소득상품

- [ ] 목록 표시
- [ ] 상세 이동
- [ ] 연결 생활서비스 표시
- [ ] 주민 역할 표시
- [ ] 수익 환류 설명 표시
- [ ] 문의 동작

### 코스

- [ ] 목록 표시
- [ ] 상세 일정 표시
- [ ] 관련 숙소·체험 연결
- [ ] 모바일 가독성 확보

### 문의폼

- [ ] 필수값 검증
- [ ] 개인정보 동의 체크
- [ ] 제출 가능
- [ ] 관리자에서 확인 가능

---

## 관리자 QA

- [ ] 관리자 로그인 또는 보호 처리
- [ ] 대시보드 집계 표시
- [ ] Region CRUD
- [ ] BusinessProfile CRUD
- [ ] Accommodation CRUD
- [ ] Experience CRUD
- [ ] LocalIncomeProgram CRUD
- [ ] Course CRUD
- [ ] Inquiry 상태 변경
- [ ] Partner Application 상태 변경
- [ ] TrainingCourse 기본 관리
- [ ] Certification 배지 부여

---

## 데이터 QA

- [ ] 모든 주요 데이터에 regionId 존재
- [ ] 공개 화면은 status=published만 표시
- [ ] 관리자 화면은 draft/inactive도 확인 가능
- [ ] LeadEvent에 itemType, itemId, actionType 저장
- [ ] 문의에는 개인정보 최소값만 저장
- [ ] Seed data 실행 가능

---

## MVP 제외 확인

아래 기능은 구현하지 않는다.

- [ ] 자체 결제 없음
- [ ] 자동 정산 없음
- [ ] 실시간 객실 재고 없음
- [ ] 후기 시스템 없음
- [ ] 차량 배차 없음
- [ ] 포인트 없음
- [ ] 쿠폰 없음