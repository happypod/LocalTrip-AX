# Screen IA

## Public Routes

- `/`
- `/stays`
- `/stays/[slug]`
- `/experiences`
- `/experiences/[slug]`
- `/programs`
  - `/programs`: [x] 소원권역 주민소득상품 목록 (모바일 우선 1열/다열 카드, T-008 완료)
    - `LocalIncomeProgram` 모델 기준 `regionId=sowon` & `status=published` 조회
    - `linkedLifeService`, `residentRole` 정보 강조
  - `/programs/[slug]`: [x] 주민소득상품 상세 (T-008 완료)
    - 생활서비스 연계, 주민 역할, 수익 환류 구조를 별도 카드 블록으로 명확히 구분
    - `program-cta` 적용 (운영/전화/카카오/웹사이트 등, 실제 예약 결제 배제)
- `/courses`
  - `/courses`: [x] 추천 코스 목록 (T-009 완료)
  - `/courses/[slug]`: [x] 추천 코스 상세 (T-009 완료)
- `/map`: [x] 권역 기반 탐색 플레이스홀더 (T-010 완료)
  - 빌드 안전성을 위해 실제 지도 API 대신 `MapPlaceholder` 적용
  - 숙소, 체험, 주민소득상품, 코스를 권역/아이템타입 기준으로 필터링
- `/partner/apply`

### T-005 홈 화면 구성
- **상단 헤더**: 서비스 소개 및 핵심 CTA (숙소/체험/주민소득상품)
- **카테고리 네비게이션**: 4개 핵심 도메인 진입점 (Stay, Experience, Program, Course)
- **콘텐츠 프리뷰**: 각 카테고리별 최신/추천 데이터 2개씩 노출
- **하단 섹션**: 파트너 입점 신청 및 로컬 지도 진입점

## Admin Routes

- `/admin`
- `/admin/regions`
- `/admin/businesses`
- `/admin/stays`
- `/admin/experiences`
- `/admin/programs`
- `/admin/courses`
- `/admin/inquiries`
- `/admin/partner-applications`

## Public Screen Rules

- 사용자 화면은 모바일 우선으로 구성한다.
- 숙소, 체험, 주민소득상품은 목록과 상세 화면에서 명확히 구분한다.
- 공개 화면에는 `status=published` 데이터만 노출한다.
- `draft`, `inactive` 데이터는 공개 화면에 노출하지 않는다.
- 이미지가 없거나 실패하면 fallback UI를 보여준다.
- 지도 화면은 MVP에서 API 연동 없이 placeholder로 충분하다.

## Detail CTA Rules

상세 화면 CTA는 항목별 설정값이 있는 경우에만 노출한다.

- 전화
- 카카오
- 네이버예약
- 홈페이지
- 문의폼

CTA 클릭은 `LeadEvent`로 기록한다. 단, `LeadEvent` 기록 실패가 사용자 이동, 전화 연결, 문의 흐름을 막아서는 안 된다.

## Admin Screen Rules

- 관리자 화면은 실제 운영자가 상품을 등록, 수정, 비공개 처리할 수 있어야 한다.
- CRUD는 단순하게 유지하되 필수 운영 필드는 빠뜨리지 않는다.
- 관리자 접근은 MVP에서도 최소 보호 대상이다.
