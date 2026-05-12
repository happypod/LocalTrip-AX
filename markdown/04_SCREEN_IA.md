# 04_SCREEN_IA.md

## 사용자 화면 IA

### 1. Home

URL:

- /

구성:

1. Hero
   - 소원권역 로컬체류여행 소개
   - 숙박·체험·주민소득사업 연결 메시지
   - 주요 CTA: 숙소 보기, 체험 보기, 입점 문의

2. 추천 섹션
   - 오늘의 추천 숙소
   - 추천 체험
   - 주민이 운영하는 로컬프로그램
   - 1박 2일 추천 코스

3. 지역 섹션
   - 만리포
   - 천리포
   - 파도리
   - 모항·의항

4. 플랫폼 설명
   - 숙박만이 아닌 지역 경험
   - 주민소득사업과 연결
   - 생활서비스 환류 구조

---

### 2. Accommodations

URL:

- /stays

기능:

- 숙소 목록
- 필터
- 지역 선택
- 태그 선택
- 지도 보기
- 상세 이동

---

### 3. Accommodation Detail

URL:

- /stays/[slug]

기능:

- 이미지 갤러리
- 숙소 소개
- 편의시설
- 가격 범위
- 문의 CTA
- 전화 클릭
- 카카오 클릭
- 네이버예약 클릭
- 주변 체험 추천

---

### 4. Experiences

URL:

- /experiences

기능:

- 체험 목록
- 카테고리 필터
- 가족형, 어촌형, ESG형 등 태그
- 상세 이동

---

### 5. Experience Detail

URL:

- /experiences/[slug]

기능:

- 체험 소개
- 운영시간
- 소요시간
- 가격
- 인원
- 준비물
- 안전안내
- 문의 CTA

---

### 6. Local Income Programs

URL:

- /programs

기능:

- 주민소득상품 목록
- 생활서비스 연계 태그
- 주민 운영자 표시
- 상세 이동

---

### 7. Program Detail

URL:

- /programs/[slug]

기능:

- 주민소득상품 설명
- 연결 생활서비스
- 주민 역할
- 수익 환류 설명
- 문의 CTA

---

### 8. Courses

URL:

- /courses

기능:

- 추천 코스 목록
- 가족형, 커플형, 단체형, ESG형 필터
- 코스 상세

---

### 9. Map

URL:

- /map

기능:

- 숙소, 체험, 로컬상품, 주차, 화장실, 관광지 표시
- MVP에서는 지도 API가 부담되면 static map placeholder 허용
- 지도 연동은 별도 티켓에서 구현

---

### 10. Partner Apply

URL:

- /partner/apply

기능:

- 입점신청
- 숙소주 신청
- 체험운영자 신청
- 주민사업체 신청
- 연락처
- 상품 아이디어
- 관리자 확인 상태

---

### 11. Inquiry

URL:

- 공통 모달 또는 /inquiry

기능:

- 상품별 문의
- 이름
- 연락처
- 희망일
- 인원
- 메시지
- 개인정보 동의

---

## 관리자 화면 IA

### Admin Layout

URL:

- /admin

구성:

- 대시보드
- 지역 관리
- 숙소 관리
- 체험 관리
- 주민소득상품 관리
- 코스 관리
- 문의 관리
- 입점신청 관리
- 교육·인증 관리
- 통계

---

### Admin Dashboard

표시:

- 전체 숙소 수
- 전체 체험 수
- 주민소득상품 수
- 문의 수
- 전화 클릭 수
- 카카오 클릭 수
- 네이버예약 클릭 수
- 최근 입점신청
- 인기 상품 Top 5

---

### Admin CRUD

대상:

- Region
- BusinessProfile
- Accommodation
- Experience
- LocalIncomeProgram
- Course
- Inquiry
- Certification
- TrainingCourse