# T-068 Premium PR QA / 보안 기준 점검

## 점검 범위

- T-061 데이터 구조
- T-062 공개 숙소 상세 노출
- T-063 관리자 입력 UI
- T-064 LeadEvent 수집
- T-065 제작대행 신청 폼/API
- T-066 관리자 제작대행 관리 화면
- T-067 현장 제작 Workflow 문서

## 보안/QA 기준

| 영역 | 기준 | 상태 |
|---|---|---|
| 데이터 구조 | `Accommodation.premiumPr` JSON 필드와 기본값 유지 | 확인 |
| URL 보안 | iframe URL allowlist 적용 | 확인 |
| 공개 노출 | `isPremium=true`와 허용 URL이 있을 때만 노출 | 확인 |
| 관리자 저장 | Server Action에서 관리자 세션과 URL 검증 | 확인 |
| LeadEvent | Premium PR 클릭은 `website_click` + metadata로 저장 | 확인 |
| 제작 신청 | 개인정보 동의와 필수값 서버 검증 | 확인 |
| 관리자 목록 | 메시지 원문 미전달, 개인정보 마스킹 | 확인 |
| 상세 조회 | `sowon` 권역 + `businessType` 검증 | 확인 |
| 상태 변경 | `requireAdminSession()`과 상태 allowlist 적용 | 확인 |

## 남은 운영 리스크

- 실제 Premium PR 활성 샘플 데이터가 있어야 공개 UI와 LeadEvent를 운영 환경에서 끝까지 확인할 수 있다.
- 실제 현장 촬영 전 초상권/개인정보 동의 양식을 별도로 확보해야 한다.
- 결제/정산/구독 과금은 여전히 제외 범위다.
