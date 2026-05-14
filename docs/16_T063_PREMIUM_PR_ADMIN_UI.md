# T-063 관리자 Accommodation Premium PR 입력 UI

## 목적

운영자가 관리자 숙소 생성/수정 화면에서 숙소별 Premium PR 옵션을 직접 입력하고 저장할 수 있게 한다.

## 구현 범위

- `/admin/stays/new`
- `/admin/stays/[id]/edit`
- `src/components/admin/stays/stay-form.tsx`
- `src/app/admin/stays/actions.ts`

## 관리자 입력 항목

- `프리미엄 PR 적용` 체크박스
- Matterport 3D 투어 URL
- 호스트 영상 Embed URL
- 드론 영상 Embed URL
- 배지 문구
- PR 패키지명
- 노출 종료일

## 저장 구조

입력값은 `Accommodation.premiumPr` JSON 필드에 저장한다.

```json
{
  "isPremium": true,
  "features": {
    "matterportUrl": "https://my.matterport.com/show/?m=...",
    "hostVideoUrl": "https://www.youtube.com/embed/...",
    "droneViewUrl": "https://player.vimeo.com/video/..."
  },
  "display": {
    "badgeLabel": "3D 숙소 투어"
  },
  "contract": {
    "packageName": "3D+호스트 영상 패키지",
    "expiresAt": "2026-12-31"
  }
}
```

`프리미엄 PR 적용`을 해제하면 `premiumPr`는 기본값인 `{"isPremium": false}` 구조로 정리된다.

## 서버 검증 기준

- 모든 숙소 생성/수정 Server Action은 기존처럼 `requireAdminSession()`을 먼저 호출한다.
- `isPremium=false`이면 URL 값은 공개 노출 대상에서 제외하고 기본 구조로 저장한다.
- `isPremium=true`이면 Matterport, 호스트 영상, 드론 영상 중 하나 이상의 URL이 필요하다.
- iframe URL은 allowlist를 통과해야 한다.
  - `https://my.matterport.com/show/`
  - `https://www.youtube.com/embed/`
  - `https://www.youtube-nocookie.com/embed/`
  - `https://player.vimeo.com/video/`
- 노출 종료일은 값이 있을 경우 `YYYY-MM-DD` 형식이어야 한다.

## 제외 범위

- 결제, 정산, 구독 과금 자동화
- 파일 업로드
- Matterport/YouTube/Vimeo API 연동
- Premium PR 클릭 `LeadEvent` 수집

## 다음 티켓 인계

- T-064에서 Premium PR 배지/영상 클릭 이벤트를 `LeadEvent`로 수집한다.
- T-065 이후 B2B 제작대행 신청 폼과 운영 프로세스를 별도 기능으로 다룬다.
