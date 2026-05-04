# Data Model (Draft)

- Region
- BusinessProfile
- Accommodation
- Experience
- LocalIncomeProgram
- Course
- CourseItem
- Inquiry
- PartnerApplication
- LeadEvent
- TrainingCourse
- Certification

- linkedLifeService
- residentRole
- revenueUse

모든 주요 공개/운영 모델은 regionId를 가진다.
공개 화면에는 status=published 데이터만 노출한다.
draft, inactive 데이터는 공개 화면에 노출하지 않는다.
Accommodation, Experience, LocalIncomeProgram, Course는 서로 흡수하지 않는다.
LeadEvent는 전화, 카카오, 네이버예약, 홈페이지, 문의 제출 등의 행동을 기록한다.
Inquiry는 이름, 연락처, 문의 내용, 개인정보 동의 여부 정도만 수집한다.

## T-003 스키마 설계 요약
- **상태 관리**: `PublishStatus` (draft, published, inactive) enum을 통해 공개 여부 관리
- **LeadEvent**: `LeadEventType` enum을 사용하여 각 이벤트(전화, 카카오, 네이버예약, 홈페이지 링크 클릭 및 문의/신청 제출)를 best-effort 기반으로 로깅
- **CourseItem 설계**: 하나의 `CourseItem` 레코드는 `accommodationId`, `experienceId`, `localIncomeProgramId` 중 단 하나만 가지도록 의도됨. Prisma 레벨의 완벽한 XOR 제약 설정이 어렵기 때문에 애플리케이션 레벨(API/Service 로직)에서 검증.
- **이미지 및 CTA**: 이미지(`images`)는 `String[]`로 단순화하며, 각 모델이 고유의 연락망(`phone`, `kakaoUrl`, `naverBookingUrl`, `websiteUrl`)을 갖도록 설계.
- **이미지 fallback**: 숙소, 체험, 주민소득상품, 코스의 `images`는 `@default([])`를 사용해 이미지가 없는 데이터도 저장 가능하도록 설계.
- **지역 식별자**: `Region.slug`는 필수 unique 값으로 두어 seed, 공개 라우팅, 관리자 필터링의 기준으로 사용.
- **조회 인덱스**: 공개/운영 모델은 `regionId + status` 조회를 고려해 인덱스를 추가하고, `LeadEvent`는 `regionId + eventType + createdAt` 집계를 고려해 인덱스를 추가.

## T-004 시드 데이터 구성
- **지역**: `sowon` (소원권역) 1개 생성
- **비즈니스 프로필**: 숙소, 체험, 주민소득상품 운영자 등 5개 목업 데이터
- **콘텐츠**:
  - 숙소: 이미지 보유/미보유, 다양한 CTA 조합의 3개 데이터 (`/stays/[slug]` 경로 준수)
  - 체험: 실제 서핑, 공예 등 실용적 설명이 포함된 3개 데이터 (`/experiences/[slug]` 경로 준수)
  - 주민소득상품: 생활서비스 연계 및 수익 환원 계획이 포함된 특화 데이터 3개 (`/programs/[slug]` 경로 준수)
- **추천 코스**: 숙소-체험-주민상품을 잇는 2개 코스 (XOR 관계 준수, `/courses/[slug]` 경로 준수)
- **전환 트래킹**: IA 경로와 일치하는 `LeadEvent` 샘플 5개 포함
- **데이터 품질**: 실제 인물/번호로 오해받지 않도록 "운영자 01", "010-0000-0001" 등 명확한 예시 데이터 사용 및 운송(Transport) 제외 범위 준수
