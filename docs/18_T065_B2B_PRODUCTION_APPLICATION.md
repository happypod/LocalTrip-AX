# T-065 B2B Premium PR 제작대행 신청 폼

## 목적

숙소, 체험, 주민소득상품 운영자가 소원로컬트립 운영 조직에 Premium PR 제작대행을 문의할 수 있는 공개 신청 경로를 제공한다.

## 구현 경로

- 공개 페이지: `/partner/premium-pr`
- 신청 API: `/api/premium-pr-applications`
- 저장 모델: `PartnerApplication`
- 구분값: `businessType=premium_pr_production`

## 수집 항목

- 운영 주체 유형
- 사업장/단체명
- 신청자명
- 연락처
- 이메일
- 지역/주소
- 현재 홈페이지 또는 예약 링크
- 관심 제작 항목
- 희망 일정
- 예산 범위 또는 상담 희망 여부
- 요청 메모
- 개인정보 수집 및 이용 동의

## 관심 제작 항목 Allowlist

- `matterport_3d`
- `host_video`
- `drone_video`
- `detail_page_pr`
- `annual_premium_exposure`
- `consulting`

## 저장 기준

신청 본문은 기존 `PartnerApplication.message`에 구조화된 텍스트로 저장한다. 신규 DB 모델은 추가하지 않는다.

`LeadEvent`는 best-effort로 기록한다.

- `eventType`: `partner_apply_submit`
- `targetType`: `general`
- `targetId`: `premium_pr_apply`
- `metadata.applicationType`: `premium_pr_production`

## 제외 범위

- 결제
- 정산
- 구독 과금
- 파일 업로드
- 촬영 일정 자동 배정
- 외부 촬영/영상 플랫폼 API 연동

## QA 기준

- 개인정보 동의 없이 제출할 수 없다.
- 서버에서도 필수값과 개인정보 동의를 검증한다.
- 관심 제작 항목은 allowlist만 허용한다.
- Region 저장 실패는 성공으로 응답하지 않는다.
- LeadEvent 저장 실패는 신청 접수 성공에 영향을 주지 않는다.
