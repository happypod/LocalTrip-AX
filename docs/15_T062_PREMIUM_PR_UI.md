# T-062 숙소 상세 Premium PR 노출 UI

## 목적

숙소 기본 상세 레이아웃은 동일하게 유지하면서, Premium PR 옵션이 활성화된 숙소에만 3D 투어와 영상 콘텐츠를 조건부로 노출한다.

## 구현 범위

- `/stays/[slug]` 상세 페이지에 Premium PR UI를 연결한다.
- `premiumPr.isPremium=true`이고 검증된 URL이 있을 때만 UI를 노출한다.
- Matterport URL은 대표 이미지 위 `3D 숙소 투어` 배지와 전체 화면 모달로 제공한다.
- Host video URL과 Drone video URL은 상세 본문 안의 `미리 둘러보는 숙소 이야기` 섹션에서 iframe으로 제공한다.
- 일반 숙소와 URL 검증 실패 데이터는 기존 상세 화면만 유지한다.

## URL 보안 기준

공개 iframe은 `src/lib/premium-pr.ts`의 allowlist를 통과한 URL만 허용한다.

- `https://my.matterport.com/show/`
- `https://www.youtube.com/embed/`
- `https://www.youtube-nocookie.com/embed/`
- `https://player.vimeo.com/video/`

`http`, 일반 YouTube watch URL, 임의 도메인, 빈 문자열은 공개 화면에 렌더링하지 않는다.

## 사용자 경험 기준

- 모바일에서 `3D 숙소 투어` 배지는 대표 이미지 우측 하단에 터치 가능한 크기로 배치한다.
- 모달은 닫기 버튼과 Escape 키로 닫을 수 있어야 한다.
- 모달이 열려 있는 동안 body scroll을 잠근다.
- 영상 섹션은 CTA보다 앞에 배치하되, 기본 숙소 설명을 방해하지 않는다.

## QA 체크리스트

- [x] 일반 숙소에는 Premium PR 배지와 영상 섹션이 노출되지 않는다.
- [x] 허용되지 않은 iframe URL은 노출되지 않는다.
- [x] Matterport URL이 있을 때만 `3D 숙소 투어` 배지가 노출된다.
- [x] Host video와 Drone video는 각각 URL이 있을 때만 노출된다.
- [x] `npm run lint` 통과.
- [x] `npm run build` 통과.

## 다음 티켓 인계

- T-063: 관리자 숙소 생성/수정 폼에서 Premium PR JSON을 입력하고 저장하는 UI를 구현한다.
- T-064: Premium PR 배지/영상 클릭을 `LeadEvent`로 수집한다.
