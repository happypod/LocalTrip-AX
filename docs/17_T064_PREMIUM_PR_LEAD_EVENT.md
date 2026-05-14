# T-064 Premium PR LeadEvent 수집

## 목적

Premium PR 콘텐츠의 실제 상호작용을 `LeadEvent`로 저장해 B2B PR 상품의 성과 분석 근거를 만든다.

## 구현 방식

DB enum을 새로 늘리지 않고 기존 `LeadEventType.website_click`을 사용한다. 대신 `metadata.originalAction`과 Premium PR 전용 metadata를 함께 저장해 이후 리포트에서 세분화할 수 있게 한다.

## 수집 액션

클라이언트 액션 타입:

- `premium_pr_matterport_click`
- `premium_pr_host_video_click`
- `premium_pr_drone_video_click`

저장되는 `LeadEvent`:

- `eventType`: `website_click`
- `targetType`: `accommodation`
- `targetId`: 숙소 ID
- `sourcePath`: 현재 숙소 상세 경로
- `metadata.originalAction`: 실제 Premium PR 액션 타입
- `metadata.itemSlug`: 숙소 slug
- `metadata.targetUrl`: iframe URL
- `metadata.premiumPrFeature`: `matterport`, `host_video`, `drone_video`
- `metadata.premiumPrPlacement`: `hero_badge`, `section_button`, `video_card`

## 수집 위치

- 대표 이미지 우측 하단 `3D 숙소 투어` 배지 클릭
- 상세 본문 `3D 숙소 투어` 버튼 클릭
- 호스트 영상 카드 첫 상호작용
- 드론 영상 카드 첫 상호작용

영상 iframe 내부의 재생 버튼 이벤트는 cross-origin iframe 정책상 직접 읽지 않는다. 대신 사용자가 영상 카드와 처음 상호작용한 시점만 1회 기록한다.

## 안정성 기준

- LeadEvent 저장 실패는 기존 CTA와 동일하게 사용자 경험을 막지 않는다.
- `fetch(..., keepalive: true)`를 유지한다.
- 공개 API는 추가 metadata를 문자열/숫자/불리언/null 값만 허용하고, key 길이와 문자 범위를 제한한다.
- 클라이언트가 보낸 metadata가 `originalAction`, `itemSlug`, `targetUrl`을 덮어쓰지 못하게 서버에서 최종값을 다시 지정한다.

## 제외 범위

- DB enum 확장
- 별도 Premium PR 리포트 UI
- iframe 내부 재생/정지 이벤트 추적
- 외부 플랫폼 API 연동
