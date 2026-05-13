# Map API Integration Strategy

이 문서는 LocalTrip AX의 `/map` 라우트를 실제 동작하는 Interactive Map으로 전환하기 위한 API 연동 기획 및 아키텍처 가이드라인입니다. (T-049 지시사항 기준)

## 1. 현재 구조 분석
- **라우트**: `src/app/map/page.tsx`
- **데이터 흐름**: DB에서 `Accommodation`, `Experience`, `LocalIncomeProgram`, `Course` 데이터를 병렬 조회한 후, `slug`나 `address`/`location` 문자열을 기반으로 `guessRegion` 함수를 통해 임시 권역 텍스트 매핑 수행 중.
- **좌표 데이터 상태**: T-050 이후 `Accommodation`, `Experience`, `LocalIncomeProgram`, `BusinessProfile`에는 `latitude`, `longitude`, `mapPlaceId` 등의 선택 필드가 존재함. 실제 지도 표출은 좌표가 입력된 콘텐츠만 marker로 처리하고, 좌표가 없는 콘텐츠는 목록 fallback으로 분리함.
- **Fallback UI**: `MapShell` 컴포넌트가 임시로 권역명 리스트를 띄우거나 placeholder 이미지를 보여주는 상태.

## 2. 지도 API 후보 비교

| 검토 항목 | A. Naver Maps | B. Kakao Maps | C. Google Maps | D. OpenStreetMap (Leaflet) |
| :--- | :--- | :--- | :--- | :--- |
| **국내 사용자 친화성** | 매우 높음 (압도적) | 매우 높음 (카카오내비 연동 유리) | 보통 (국내 규제로 디테일 부족) | 낮음 (국내 POI 희소) |
| **외국인/다국어 확장성**| 낮음 (국내 중심) | 낮음 | **매우 높음** | 보통 |
| **비용 구조 (무료구간)** | 월간 상당량 무료 (Web Dynamic Map) | 일 30만 건 무료 (매우 넉넉) | 넉넉한 무료 크레딧 제공 | 무료 |
| **개발 연동 난이도** | 중간 (React 래퍼 부족) | 낮음 (`react-kakao-maps-sdk` 등 활성) | 낮음 (`@vis.gl` 공식 지원) | 낮음 (`react-leaflet`) |

## 3. 최종 권장안

**1차 권장: Naver Maps**
- **이유**: 소원면/만리포 등 태안 로컬 관광의 주 수요층은 현재 내국인이며, 도보 및 차량 경로 탐색 시 네이버 지도의 지형지물 디테일이 구글이나 오픈소스보다 압도적으로 뛰어나기 때문입니다. 운영 단일화와 환경변수 파편화를 방지하기 위해 1차 Provider는 Naver Maps로 확정합니다.

**확장 및 보조 후보: Google Maps**
- **이유**: EN/CN/JP 다국어 방문자 유입이 본격화되는 Post-MVP 페이즈에서는 브라우저 언어 설정에 맞춰 다국어 POI를 즉각 렌더링하는 Google Maps가 필수적입니다. 추후 언어 설정(`PersonaThemeStore`의 `currentLang`)에 따라 분기 렌더링을 고려합니다.

## 4. 데이터 모델 영향 및 좌표 추가 정책

지도 API를 제대로 구동하기 위해선 텍스트 주소가 아닌 `(lat, lng)` 좌표가 필수적입니다.

- **추가 검토 필드**: 
  - `latitude Float?`
  - `longitude Float?`
  - `mapAddress String?` (API 검색용 정규화 주소)
  - `mapPlaceId String?` (지도 API가 제공하는 고유 장소 식별자)
- **적용 대상 모델**: `Accommodation`, `Experience`, `LocalIncomeProgram`, `BusinessProfile`
- **입력 정책 (MVP+1)**: 
  - **1차 수동 입력**: 관리자 패널에서 운영자가 위도/경도를 직접 입력하도록 필드를 개방합니다. (가장 확실하고 개발 공수가 적음)
  - **2차 자동 지오코딩**: 주소 입력 시 네이버/카카오 지오코딩 API를 백그라운드 호출해 좌표를 자동 채워주는 버튼("주소로 좌표 찾기")을 관리자 UI에 추가합니다.

## 5. 환경변수 (Environment Variables) 기준

지도 API 연동을 위해 Vercel 환경별 분리가 필요합니다.

```env
# Client-side 렌더링 및 SDK 로딩용 (반드시 NEXT_PUBLIC_ 접두어 사용)
NEXT_PUBLIC_MAP_PROVIDER="naver" # "naver", "kakao", "google"
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID="발급받은_클라이언트_아이디"

# Server-side 지오코딩 및 백엔드 API 호출용 (보안)
NAVER_MAP_CLIENT_SECRET="발급받은_시크릿_키"
```
*주의: `NEXT_PUBLIC` 키라도 Vercel 콘솔에서 API Key Origin(도메인) 제한을 설정하여 어뷰징을 차단해야 합니다.*

## 6. 프론트엔드 구현 방식 초안

- **SDK 로딩**: `next/script` 컴포넌트를 사용하여 `strategy="lazyOnload"`로 렌더링 블로킹을 최소화. (`src/components/map/public-map-client.tsx` 적용 완료)
- **Client-only Map**: 지도 캔버스는 `window.naver.maps` 객체에 의존하므로 `"use client"` 지시어가 있는 `PublicMapClient`에서 마운트. 환경변수(`NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`)가 없을 시 기존 Fallback 리스트 UI 노출.
- **권장 마커 데이터 구조**:
  ```typescript
  type MapMarkerItem = {
    id: string;
    type: "stay" | "experience" | "program" | "event";
    title: string;
    summary: string;
    slug: string;
    href: string;
    imageUrl?: string;
    latitude: number;
    longitude: number;
    address?: string;
  };
  ```

## 7. 이벤트 트래킹 규칙 (T-053 적용 완료)

별도의 지도 중심 이벤트 스키마를 새로 파지 않고, 기존 `LeadEvent` 시스템에 편승한다.

- `eventType`: `"website_click"`
- `metadata`:
  ```json
  {
    "source": "map_marker",
    "action": "marker_click" | "detail_click" | "directions_click",
    "provider": "naver",
    "targetType": "accommodation" | "experience" | "local_income_program" | "business_profile",
    "targetSlug": "sowon-surfing",
    "targetTitle": "만리포 서핑"
  }
  ```
- **실패 처리**: 로깅 API 호출(`navigator.sendBeacon` 또는 `fetch keepalive`)이 실패해도 지도 UX(상세 카드 스크롤, 외부 링크 이동 등)는 **절대 중단되지 않아야 함**.

## 7. 후속 티켓 제안

이 기획을 실체화하기 위한 다음 단계의 티켓을 제안합니다.

- **T-050 지도 좌표 필드 Prisma 설계**: 위/경도 스키마 추가.
- **T-051 관리자 좌표 입력 UI**: 백오피스 좌표 입력 폼 추가.
- **T-052 공개 지도 API 연동**: `/map` 라우트 지도 렌더링 교체.
- **T-053 지도 marker LeadEvent 연결**: 맵 마커 인터랙션 트래킹.
