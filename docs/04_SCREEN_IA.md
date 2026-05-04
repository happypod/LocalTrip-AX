# Screen IA

## Public Routes

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
