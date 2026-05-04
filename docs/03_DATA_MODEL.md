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
