# B2B Premium PR / 콘텐츠 제작대행 BM

## 1. 목적

숙소 상세 페이지의 기본 레이아웃은 동일하게 유지하되, 프리미엄 옵션을 구매한 숙소에만 VR/3D 투어, 호스트 영상, 드론 영상 같은 고부가 콘텐츠를 노출한다.

이 기능의 목적은 예약/결제를 MVP 안으로 끌어오는 것이 아니라, 플랫폼 내부 체류와 문의 전환을 높이고 숙박업주 대상 B2B PR 상품과 현장 콘텐츠 제작대행 매출 구조를 만드는 것이다.

## 2. 범위

### In Scope

- 숙소별 프리미엄 PR 옵션 저장
- 숙소 상세 페이지 내부 프리미엄 콘텐츠 노출
- VR/3D 투어 모달
- 호스트 이야기 영상 섹션
- 드론 영상 또는 외부 임베드 콘텐츠 노출
- 관리자 숙소 폼에서 프리미엄 PR 정보 관리
- 프리미엄 콘텐츠 클릭 `LeadEvent` 수집
- 업주용 콘텐츠 제작대행 상담 신청
- 운영자/현장센터용 제작대행 상태 관리

### Out of Scope

- 플랫폼 내 숙박 결제
- 실시간 예약 확정
- 정산
- 환불/취소 관리
- PG 연동
- 자동 구독 과금
- 숙박 재고 관리

## 3. 데이터 설계 원칙

1차 구현은 별도 테이블을 많이 늘리지 않고 `Accommodation`에 JSON 확장 필드를 추가하는 방식이 적합하다.

현재 프로젝트는 Prisma + PostgreSQL 구조다. Supabase를 사용하더라도 Supabase는 PostgreSQL 관리형 서비스이므로 Prisma schema 기준으로 관리한다.

권장 Prisma 필드:

```prisma
model Accommodation {
  // ...
  premiumPr Json @default("{\"isPremium\":false}")
}
```

PostgreSQL/Supabase에서는 Prisma `Json` 필드가 JSONB 저장 구조로 매핑된다.

## 4. 권장 JSON 구조

```json
{
  "isPremium": true,
  "features": {
    "matterportUrl": "https://my.matterport.com/show/?m=xxxxxx",
    "hostVideoUrl": "https://www.youtube.com/embed/xxxxxx",
    "droneViewUrl": null
  },
  "display": {
    "badgeLabel": "VR로 미리보기"
  },
  "contract": {
    "packageName": "premium-pr-basic",
    "expiresAt": "2027-05-31"
  }
}
```

일반 숙소 기본값:

```json
{
  "isPremium": false
}
```

## 5. UI 노출 기준

숙소 상세의 기본 정보 구조는 모든 숙소가 동일하게 유지한다.

프리미엄 숙소에만 다음 UI를 조건부 노출한다.

- 대표 이미지 우측 하단 `VR로 미리보기` 배지
- 클릭 시 전체 화면 VR/3D iframe 모달
- 상세 중단 `호스트가 직접 전하는 마을 이야기` 영상 섹션
- 드론 영상 또는 추가 미디어 섹션

`premiumPr.isPremium`이 `false`이면 URL이 있어도 공개 화면에 노출하지 않는다.

## 6. URL 보안 기준

iframe URL은 allowlist 기반으로 검증한다.

허용 후보:

- `my.matterport.com`
- `www.youtube.com/embed`
- `www.youtube-nocookie.com/embed`
- `player.vimeo.com`

허용되지 않은 URL은 관리자 저장 단계에서 거부하고, 공개 화면에서도 렌더링하지 않는다.

## 7. LeadEvent 기준

프리미엄 콘텐츠는 운영 성과 분석 대상이다.

권장 이벤트:

- `premium_vr_click`
- `premium_video_click`
- `premium_drone_click`

1차 구현에서는 기존 `LeadEvent.metadata Json`에 세부 정보를 담는 방식을 우선 검토한다. 필요하면 `LeadEventType` enum을 확장한다.

LeadEvent 저장 실패는 사용자 콘텐츠 열람을 막지 않는다.

## 8. 관리자 운영 기준

관리자 숙소 생성/수정 폼에 다음 영역을 추가한다.

- `프리미엄 PR 적용` 체크박스
- Matterport URL
- Host video embed URL
- Drone video embed URL
- 배지 문구
- 패키지명
- 노출 종료일

서버 액션에서 검증해야 하는 항목:

- 관리자 세션
- `premiumPr` JSON 구조
- URL allowlist
- 노출 종료일 형식
- `isPremium=false`일 때 공개 노출 차단

## 9. 제작대행 BM

현장센터와 지역 활동가 조직이 직접 콘텐츠 제작대행 상품을 운영할 수 있다.

운영 상품 예시:

- 3D/VR 촬영
- 호스트 인터뷰 영상
- 드론 영상
- 숙소 상세 PR 패키지
- 연간 프리미엄 노출 관리

업주용 신청 폼은 결제 없이 상담 신청까지만 제공한다.

수집 항목:

- 숙소명
- 담당자명
- 연락처
- 희망 상품
- 요청 메모
- 개인정보 동의

## 10. Post-MVP 티켓

상세 티켓은 [13_POST_MVP_TICKETS.md](./13_POST_MVP_TICKETS.md)의 T-061~T-068을 기준으로 한다.

- T-061 Accommodation Premium PR JSON 필드 설계
- T-062 숙소 상세 Premium PR 노출 UI
- T-063 관리자 Accommodation Premium PR 입력 UI
- T-064 Premium PR LeadEvent 수집
- T-065 B2B 콘텐츠 제작대행 신청 폼
- T-066 B2B 제작대행 관리자 관리 화면
- T-067 현장센터 제작 Workflow 문서화
- T-068 Premium PR QA / 보안 기준

## 11. T-061 확정 구현 기준

T-061에서는 `Accommodation`에 Premium PR 전용 JSON 필드와 앱 레벨 정규화 유틸을 추가한다.

### DB 필드

```prisma
premiumPr Json @default("{\"isPremium\":false}")
```

### JSON 계약

```json
{
  "isPremium": false,
  "features": {
    "matterportUrl": null,
    "hostVideoUrl": null,
    "droneViewUrl": null
  },
  "display": {
    "badgeLabel": "3D 숙소 투어"
  },
  "contract": {
    "packageName": null,
    "expiresAt": null
  }
}
```

### URL Allowlist

공개 iframe 또는 관리자 저장 검증에서 허용할 URL은 아래 출처와 경로로 제한한다.

- `https://my.matterport.com/show/`
- `https://www.youtube.com/embed/`
- `https://www.youtube-nocookie.com/embed/`
- `https://player.vimeo.com/video/`

### 제외 범위

T-061은 DB 계약과 유틸만 다룬다. 숙소 상세 노출 UI는 T-062, 관리자 입력 UI는 T-063, 클릭 이벤트 수집은 T-064에서 다룬다. 결제, 정산, 구독 과금, 예약 확정 자동화는 Premium PR 단계에서도 제외한다.

## 12. T-063 관리자 입력 UI 구현 기준

T-063에서는 관리자 숙소 생성/수정 화면에서 `Accommodation.premiumPr` JSON을 입력하고 저장한다.

- `프리미엄 PR 적용` 체크박스가 꺼져 있으면 `isPremium=false` 기본 구조로 저장한다.
- 체크박스가 켜져 있으면 Matterport, 호스트 영상, 드론 영상 중 하나 이상의 URL을 요구한다.
- 저장 전 서버 액션에서 URL allowlist를 검증한다.
- 허용 URL은 Matterport show, YouTube embed, YouTube nocookie embed, Vimeo player URL로 제한한다.
- 배지 문구, PR 패키지명, 노출 종료일은 운영 관리용 메타데이터로 저장한다.
- 클릭 성과 수집은 T-064에서 처리한다.

## 13. T-064 LeadEvent 수집 기준

T-064에서는 Premium PR 콘텐츠 상호작용을 기존 `LeadEvent` 모델로 수집한다.

- DB enum 확장은 하지 않고 `eventType=website_click`으로 저장한다.
- 실제 액션은 `metadata.originalAction`에 저장한다.
  - `premium_pr_matterport_click`
  - `premium_pr_host_video_click`
  - `premium_pr_drone_video_click`
- 추가 metadata로 `premiumPrFeature`, `premiumPrPlacement`, `targetUrl`, `itemSlug`를 저장한다.
- Matterport 배지/버튼 클릭과 영상 카드 첫 상호작용을 수집한다.
- 수집 실패는 사용자 경험을 막지 않는 best-effort 방식으로 처리한다.

## 14. T-065~T-068 구현/운영 문서

- T-065 제작대행 신청 폼: [18_T065_B2B_PRODUCTION_APPLICATION.md](./18_T065_B2B_PRODUCTION_APPLICATION.md)
- T-066 제작대행 관리자 화면: [19_T066_B2B_PRODUCTION_ADMIN.md](./19_T066_B2B_PRODUCTION_ADMIN.md)
- T-067 현장 제작 Workflow: [20_T067_PREMIUM_PR_WORKFLOW.md](./20_T067_PREMIUM_PR_WORKFLOW.md)
- T-068 QA / 보안 기준: [21_T068_PREMIUM_PR_QA.md](./21_T068_PREMIUM_PR_QA.md)
