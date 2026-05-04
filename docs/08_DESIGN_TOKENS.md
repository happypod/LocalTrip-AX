# Design Tokens: LocalTrip AX / 소원로컬트립

이 문서는 LocalTrip AX MVP 개발 시 일관된 사용자 경험과 시각적 정체성을 유지하기 위한 디자인 토큰 기준을 정의합니다.

## 1. 시각 방향 (Visual Direction)
- **모바일 우선 (Mobile-First)**: 모든 UI는 모바일 환경에서의 가독성과 조작 편의성을 최우선으로 합니다.
- **실용적 미니멀리즘**: 과한 장식이나 애니메이션을 지양하고, 정보 전달과 문의 연결(CTA)에 집중하는 차분한 실용적 UI를 지향합니다.
- **일관된 카테고리 색상**: 사용자가 상품 유형을 직관적으로 구분할 수 있도록 고유 색상을 할당합니다.

## 2. 색상 토큰 (Color Tokens)

### 기본 시스템 (shadcn/ui 기반)
- **Background**: `bg-background` (화면 전체 배경)
- **Foreground**: `text-foreground` (기본 텍스트 색상)
- **Card**: `bg-card`, `border-border` (카드 배경 및 테두리)
- **Muted**: `text-muted-foreground`, `bg-muted` (보조 텍스트 및 배경)

### 카테고리 고유 색상
| 카테고리 | 토큰 변수 | 추천 활용 | 비고 |
| :--- | :--- | :--- | :--- |
| **숙소** | `category-stay` | 배지, 포인트 텍스트 | Blue-ish |
| **체험** | `category-experience` | 배지, 포인트 텍스트 | Green-ish |
| **주민소득상품** | `category-program` | 배지, 포인트 텍스트 | Orange-ish |
| **추천코스** | `category-course` | 배지, 포인트 텍스트 | Purple-ish |

## 3. 타이포그래피 (Typography)
- **기본 폰트**: `font-sans` (Inter 적용)
- **제목 (Headings)**: `tracking-tight`, `font-semibold` 또는 `font-bold`
- **본문 (Body)**: `leading-relaxed`, `text-sm` (기본), `text-base` (중요)
- **모바일 대응**: 제목 크기는 모바일에서 1~2단계 축소하여 적용.

## 4. 간격 및 여백 (Spacing)
- **페이지 컨테이너**: `px-4` (모바일), `px-6` (태블릿), `max-w-screen-xl mx-auto` (데스크톱)
- **섹션 간격**: `py-8` ~ `py-16`
- **카드 내부 패딩**: `p-4` ~ `p-6`
- **모바일 터치 영역**: 버튼 높이 최소 `h-10` 이상 (권장 `h-11` or `h-12`)

## 5. UI 요소 기준
- **Radius (둥글기)**:
  - 카드/버튼: `rounded-lg` (default)
  - 입력창/배지: `rounded-md`
- **Shadow (그림자)**:
  - 부유형 카드: `shadow-sm`
  - 호버 효과: `hover:shadow-md` (데스크톱 한정)
- **Focus Ring**: `ring-ring`, `ring-offset-2` (웹 접근성 준수)

## 6. 버튼 (CTA) 기준
- **Primary**: 문의하기, 신청하기 등 핵심 액션. `bg-primary text-primary-foreground`
- **Secondary**: 목록 보기, 상세 정보 등 보조 액션. `variant="outline"` 또는 `variant="secondary"`
- **모바일**: 주요 CTA 버튼은 화면 하단 고정(Sticky) 또는 너비 100%(`w-full`) 적용 권장.

## 7. 관리자 UI 기준
- **배경**: `bg-zinc-50` (약간의 회색조 배경으로 대시보드 느낌 강조)
- **표 (Table)**: `border-collapse`, `text-xs` ~ `text-sm` (대량 데이터 가독성)
- **Neutral**: 관리자 화면에서는 원색 계열보다는 Neutral(`zinc`, `slate`) 계열을 사용하여 업무 집중도 향상.
