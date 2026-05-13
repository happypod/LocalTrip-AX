# Data Model (Draft)

## DB Source of Truth 정리

- 공개 페이지의 숙소, 체험, 소원 별미(주민소득상품), 코스 노출 기준은 DB의 `sowon` region 및 `status = published` 데이터로 통일한다.
- 기존 `src/lib/*-data.ts` fallback 배열은 공개 화면 런타임 fallback으로 쓰지 않고, 초기 seed 입력원과 타입 참고용으로만 유지한다.
- DB 이전을 위해 `Experience.category`, `LocalIncomeProgram.category`, `LocalIncomeProgram.durationText`, `LocalIncomeProgram.capacityText`, `Course.targetType`, `Course.durationType`, `Course.season`을 선택 필드로 추가했다.
- 관리자 생성/수정 화면도 위 선택 필드를 저장하도록 연결했으므로, 이후 운영 콘텐츠는 관리자 페이지 또는 `prisma/seed.ts`를 통해 DB에 적재한다.
- 2026-05-13 기준 `sowon` seed 결과: 숙소 4개, 체험 4개, 주민소득상품 11개(공개 10개), 코스 7개(공개 7개).

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
- Event

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
- **CourseItem 설계**: 하나의 `CourseItem` 레코드는 `accommodationId`, `experienceId`, `localIncomeProgramId` 중 단 하나만 가지도록 의도됨. Prisma 레벨의 완벽한 XOR 제약 설정이 어렵기 때문에 애플리케이션 레벨(API/Service 로직)에서 검증함. (`src/app/admin/courses/actions.ts`의 `validateCourseItems` 함수 참고) 또한 Course를 `published` 상태로 저장하려면 연결된 모든 대상이 `published` 상태여야만 함을 강제함.
- **이미지 및 CTA**: 이미지(`images`)는 `String[]`로 단순화하며, 각 모델이 고유의 연락망(`phone`, `kakaoUrl`, `naverBookingUrl`, `websiteUrl`)을 갖도록 설계.
- **이미지 fallback**: 숙소, 체험, 주민소득상품, 코스의 `images`는 `@default([])`를 사용해 이미지가 없는 데이터도 저장 가능하도록 설계.
- **지역 식별자**: `Region.slug`는 필수 unique 값으로 두어 seed, 공개 라우팅, 관리자 필터링의 기준으로 사용.
- **조회 인덱스**: 공개/운영 모델은 `regionId + status` 조회를 고려해 인덱스를 추가하고, `LeadEvent`는 `regionId + eventType + createdAt` 집계를 고려해 인덱스를 추가.
- **Event 운영 콘텐츠**: 이벤트도 `regionId`를 가진 운영 콘텐츠로 정비하며, 공개 조회는 `regionId + status=published` 기준을 사용한다. `Region.events` relation과 `@@index([regionId, status])`를 유지한다.

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

## T-022 교육·인증 확장 모델
- **TrainingCourse & Certification**: MVP 이후의 교육/인증 확장을 위한 운영 골격 데이터 모델입니다.
- **최소 구조 유지**: 현재는 `regionId`, `title`, `summary`, `status` 중심의 최소 CRUD 구조로 관리되며, 상세 수강신청, 출석체크, 수료증(QR/PDF) 발급, 수강료 결제 등의 기능은 MVP 스코프 아웃(Out of Scope)으로 처리하여 단순성과 코드 경량화를 유지합니다.

## T-048 다국어 확장 모델 (ContentTranslation) 스키마 설계
- **목적**: MVP 이후, 운영 콘텐츠(숙소, 체험, 코스 등)의 글로벌 다국어 지원 확장을 위한 번역 전용 데이터 모델.
- **설계 구조**: 원본 스키마의 JSON 확장이 아닌, `ContentTranslation` 테이블 분리 도입을 완료. 이를 통해 쿼리 성능, 정렬 지원, 번역 파이프라인 연계 유연성을 확보.
- **필드 정의**:
  - `targetType`: 번역 대상의 모델 종류 (String). 허용값: `accommodation`, `experience`, `local_income_program`, `course`, `event`, `training_course`, `certification`.
  - `targetId`: 번역 대상 원본 데이터의 ID.
  - `locale`: 대상 언어 식별자 (예: `en`, `zh-cn`, `ja-jp`).
  - `title`, `summary`, `description`: 언어별 실제 번역 텍스트.
  - `metadata`: 향후 번역 상태, 검수 여부, AI 초안 여부 등을 기록하기 위한 JSON Placeholder.
- **Unique & Index**:
  - 복합 Unique: `@@unique([targetType, targetId, locale])` 로직 적용으로 동일 엔티티-동일 언어의 중복 번역 방지.
  - 인덱스: `@@index([regionId, locale])`, `@@index([targetType, targetId])` 구성을 통해 지역별 필터링 및 조인 성능 최적화.

## T-050 지도 좌표 필드 Prisma 확장
- **목적**: MVP 이후 실제 지도 API(Naver/Kakao/Google) 상에 콘텐츠 마커를 렌더링하기 위한 공간 데이터(지리적 좌표) 적재 구조 추가.
- **적용 대상 모델**: `Accommodation`, `Experience`, `LocalIncomeProgram`, `BusinessProfile`
  *(참고: Event 모델은 T-069에서 region 기반 운영 콘텐츠로 정비되었지만, 지도 좌표 확장 대상에는 아직 포함하지 않습니다. Course는 여러 여정의 묶음이므로 직접 좌표 부여 대신 CourseItem 활용 원칙을 유지합니다.)*
- **추가 필드**:
  - `latitude Float?` (위도)
  - `longitude Float?` (경도)
  - `mapAddress String?` (운영자가 수동 입력하거나 지오코딩용으로 활용될 지도 정규화 주소)
  - `mapPlaceId String?` (Naver/Kakao 등 지도 API 고유 장소 ID 저장용)
  - `mapProvider String?` (Place ID 출처 표기용)
- **입력 정책**: 필수는 아니며(Optional), 초기엔 관리자가 백오피스에서 좌표를 수동 기입하고, 추후 자동 지오코딩 API 연동을 보완합니다. 반경 검색 고도화 전까지는 복잡한 공간 인덱스(PostGIS)를 도입하지 않습니다.
