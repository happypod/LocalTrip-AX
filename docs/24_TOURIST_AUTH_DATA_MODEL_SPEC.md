# Tourist Auth And User Data Model Spec

작성일: 2026-05-14

## 1. 결정 요약

T-084는 실제 관광객 회원가입/Auth 구현이 아니라, 향후 도입 전 구조를 확정하는 설계 티켓이다.

현재 결정:

- `/admin`은 플랫폼 운영자 전용 관리자 인증으로 유지한다.
- `/my`와 `/course-builder`는 관광객용 공개/게스트 영역으로 유지한다.
- 관광객 Auth는 관리자 세션 쿠키(`ltax_admin_session`)와 절대 공유하지 않는다.
- 실제 결제, 예약확정, 정산, 실시간 재고는 계속 MVP 제외로 둔다.
- T-083 맞춤코스는 `localStorage` 기반 임시 저장으로 시작하고, Auth 도입 후 DB 저장으로 이전한다.

## 2. 권장 Auth 방향

1차 권장안:

- 이메일 magic link 또는 OAuth 기반 관광객 로그인
- 관리자 계정과 별도 provider/session namespace 사용
- 관광객 세션 쿠키 예: `ltax_tourist_session`
- 관리자 action/API에는 관광객 세션을 절대 허용하지 않음

관리자 계정:

- 목적: 콘텐츠 CRUD, 문의/입점/성과 관리
- 경로: `/admin/**`
- 세션: `ADMIN_SESSION_SECRET` 기반 signed token

관광객 계정:

- 목적: 맞춤코스 저장, 찜 목록, 문의 이력, 알림 수신 설정
- 경로: `/my/**`, `/course-builder`
- 세션: 별도 Auth provider 또는 별도 signed token

## 3. 개인정보 원칙

- 관광객 계정 도입 전에는 이름, 연락처, 이메일을 `localStorage`에 저장하지 않는다.
- T-083 맞춤코스 localStorage에는 콘텐츠 id/slug/title/summary와 사용자가 직접 입력한 메모만 저장한다.
- 문의 제출 개인정보는 기존 `Inquiry` 흐름에만 저장한다.
- 마케팅/알림 수신 동의는 개인정보 동의와 분리한다.
- 미성년자/가족 여행 맥락을 고려해 생년월일, 성별 등 민감하거나 과도한 필드는 MVP 이후에도 기본 수집하지 않는다.

## 4. Prisma 모델 초안

아래는 T-084 설계 초안이며, 이번 티켓에서는 실제 `schema.prisma`에 반영하지 않는다.

```prisma
model TouristUser {
  id          String   @id @default(cuid())
  email       String?  @unique
  phone       String?  @unique
  status      String   @default("active") // active, suspended, deleted
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  profile     TouristProfile?
  tripPlans   SavedTripPlan[]
  notifications UserNotification[]
}

model TouristProfile {
  id             String      @id @default(cuid())
  touristUserId  String      @unique
  touristUser    TouristUser @relation(fields: [touristUserId], references: [id])
  displayName    String?
  preferredLang  String      @default("ko")
  preferredTheme String      @default("masil")
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

model SavedTripPlan {
  id            String      @id @default(cuid())
  touristUserId String?
  touristUser   TouristUser? @relation(fields: [touristUserId], references: [id])
  regionId      String
  title         String
  note          String?
  status        String      @default("draft") // draft, inquiry_sent, archived
  source        String      @default("course_builder")
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  items         SavedTripPlanItem[]

  @@index([regionId, status])
  @@index([touristUserId, updatedAt])
}

model SavedTripPlanItem {
  id                       String        @id @default(cuid())
  savedTripPlanId          String
  savedTripPlan            SavedTripPlan @relation(fields: [savedTripPlanId], references: [id])
  itemType                 CourseItemType
  accommodationId          String?
  experienceId             String?
  localIncomeProgramId     String?
  sortOrder                Int
  note                     String?
  createdAt                DateTime      @default(now())
  updatedAt                DateTime      @updatedAt

  @@index([savedTripPlanId, sortOrder])
}

model UserNotification {
  id            String      @id @default(cuid())
  touristUserId String
  touristUser   TouristUser @relation(fields: [touristUserId], references: [id])
  type          String      // inquiry, trip_plan, event, operator_reply
  title         String
  body          String?
  readAt        DateTime?
  createdAt     DateTime    @default(now())

  @@index([touristUserId, readAt, createdAt])
}
```

## 5. SavedTripPlanItem 검증 원칙

`SavedTripPlanItem`은 기존 `CourseItem`과 동일하게 숙소, 체험, 주민소득상품 중 하나만 연결해야 한다.

Prisma schema에서 완전한 XOR 제약을 표현하기 어렵기 때문에 앱 레벨에서 다음을 검증한다.

- `itemType=accommodation`이면 `accommodationId`만 존재
- `itemType=experience`이면 `experienceId`만 존재
- `itemType=local_income_program`이면 `localIncomeProgramId`만 존재
- 참조 콘텐츠는 같은 `regionId`에 속하고 `published` 상태여야 함

## 6. 마이그레이션 전 확인사항

- 관광객 Auth provider 결정
- 이메일/전화번호 중 로그인 식별자 우선순위 결정
- 개인정보 보관 기간과 탈퇴/삭제 정책 결정
- 알림 수신 동의와 개인정보 동의 분리 방식 결정
- 게스트 localStorage 맞춤코스를 로그인 후 DB로 가져올지 여부 결정
- 예약/결제 placeholder를 실제 모델로 확장할지 별도 티켓에서 결정

## 7. T-083에서 T-084로 이어지는 연결

T-083에서 구현한 `localStorage` 맞춤코스 payload는 향후 `SavedTripPlan`으로 이전 가능해야 한다.

현재 localStorage key:

- `ltax_custom_trip_plan_v1`

현재 저장 대상:

- 선택한 콘텐츠의 `id`, `itemType`, `slug`, `title`, `summary`, `href`
- 사용자가 입력한 여정 메모

저장하지 않는 대상:

- 이름
- 전화번호
- 이메일
- 결제 정보
- 예약 확정 정보
