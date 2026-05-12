# 03_DATA_MODEL.md

## 데이터 설계 원칙

1. 모든 주요 데이터는 regionId를 가진다.
2. 소원권역 MVP지만 전국 확장을 고려한다.
3. 숙박, 체험, 주민소득상품, 코스는 독립 모델로 관리한다.
4. 문의와 클릭 이벤트는 별도 모델로 수집한다.
5. 교육·인증은 MVP에서 최소 구조만 만든다.
6. 결제와 정산은 MVP에서 제외한다.

---

## Core Models

### Region

지역 단위.

필드 예시:

- id
- name
- slug
- parentRegionId
- description
- coverImage
- latitude
- longitude
- status
- createdAt
- updatedAt

예시:

- 태안군
- 소원권역
- 만리포
- 천리포
- 파도리
- 모항
- 의항

---

### BusinessProfile

숙소, 체험운영자, 주민사업체, 식음업체 등 사업자 공통 프로필.

필드 예시:

- id
- regionId
- name
- businessType
- ownerName
- phone
- email
- kakaoUrl
- address
- lat
- lng
- description
- status
- verifiedStatus
- createdAt
- updatedAt

businessType 예시:

- accommodation
- experience_host
- local_food
- local_product
- resident_group
- cooperative
- guide
- transport_partner
- other

---

### Accommodation

숙소.

필드 예시:

- id
- regionId
- businessProfileId
- name
- type
- description
- address
- lat
- lng
- phone
- kakaoUrl
- naverBookingUrl
- homepageUrl
- mainImage
- gallery
- priceMin
- priceMax
- capacityMin
- capacityMax
- amenities
- tags
- beachDistance
- petAllowed
- bbqAvailable
- oceanView
- familyFriendly
- groupAvailable
- exposureLevel
- status
- createdAt
- updatedAt

---

### Experience

체험상품.

필드 예시:

- id
- regionId
- businessProfileId
- title
- category
- summary
- description
- durationMinutes
- minPeople
- maxPeople
- priceAdult
- priceChild
- meetingPoint
- lat
- lng
- includedItems
- excludedItems
- preparation
- safetyNotice
- availableSeasons
- operatingDays
- phone
- kakaoUrl
- naverBookingUrl
- mainImage
- gallery
- tags
- verifiedStatus
- exposureLevel
- status
- createdAt
- updatedAt

category 예시:

- ocean
- village
- food
- ecology
- family
- esg
- craft
- education
- stay_linked
- other

---

### LocalIncomeProgram

생활서비스 연계형 주민소득상품.

필드 예시:

- id
- regionId
- businessProfileId
- title
- incomeType
- summary
- description
- linkedLifeService
- residentRole
- revenueUse
- durationMinutes
- minPeople
- maxPeople
- price
- meetingPoint
- safetyNotice
- mainImage
- gallery
- tags
- status
- createdAt
- updatedAt

incomeType 예시:

- local_food
- seaweed
- village_walk
- beach_cleaning
- craft
- water_play
- local_guide
- stay_program
- other

linkedLifeService 예시:

- 식생활
- 이동
- 환경관리
- 공동공간
- 주민일자리
- 고령자 돌봄
- 생활인구 확대

---

### Course

추천 여행 코스.

필드 예시:

- id
- regionId
- title
- targetType
- durationType
- summary
- description
- season
- routeItems
- recommendedAccommodationIds
- recommendedExperienceIds
- recommendedProgramIds
- mainImage
- tags
- status
- createdAt
- updatedAt

targetType 예시:

- family
- couple
- solo
- group
- school
- corporate
- esg
- senior

durationType 예시:

- half_day
- one_day
- two_days
- three_days

---

### Inquiry

문의.

필드 예시:

- id
- regionId
- itemType
- itemId
- name
- phone
- email
- desiredDate
- peopleCount
- message
- status
- createdAt
- updatedAt

itemType 예시:

- accommodation
- experience
- local_income_program
- course
- general

status 예시:

- new
- reviewing
- replied
- closed
- spam

---

### LeadEvent

클릭·조회 이벤트.

필드 예시:

- id
- regionId
- itemType
- itemId
- actionType
- referrer
- userAgent
- createdAt

actionType 예시:

- view
- phone_click
- kakao_click
- naver_booking_click
- homepage_click
- inquiry_submit
- map_click
- share_click

---

### TrainingCourse

주민사업체 교육과정.

필드 예시:

- id
- title
- level
- targetRole
- description
- hours
- curriculum
- certificateType
- status
- createdAt
- updatedAt

---

### Certification

인증·배지.

필드 예시:

- id
- regionId
- businessProfileId
- type
- name
- issuedAt
- expiresAt
- status
- createdAt
- updatedAt

type 예시:

- verified_stay
- safe_experience
- local_host
- family_friendly
- esg_program
- resident_income_program

---

## MVP Seed Data

초기 seed에는 아래 데이터를 포함한다.

1. Region
   - 태안군
   - 소원권역
   - 만리포
   - 천리포
   - 파도리
   - 모항
   - 의항

2. Accommodation
   - 샘플 펜션 8개

3. Experience
   - 만리포 선셋워크
   - 감태 미니클래스
   - 어촌 아침산책
   - 비치코밍 공방
   - 소원 플로깅
   - 펜션 바비큐 로컬세트

4. LocalIncomeProgram
   - 소원 바다물길 놀이터
   - 펜션 공동 키즈 워터마당
   - 로컬밥상 체험
   - 감태 포장체험
   - 항구 아침투어

5. Course
   - 가족형 1박 2일
   - 어촌형 반나절
   - ESG 해변정화 코스
   - 커플 노을코스