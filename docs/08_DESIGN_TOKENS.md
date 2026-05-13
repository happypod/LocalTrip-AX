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

## 8. 페르소나 테마 시스템 (Persona Theme Tokens)

T-042 이후 `body` 또는 컨테이너 엘리먼트의 클래스 명(예: `theme-masil`)만 변경해도 전체 애플리케이션의 색상/라운드/폰트 무드가 자동으로 동적 전환되는 페르소나 테마가 탑재되었습니다.

### 페르소나 토큰 목록 (Persona Tokens)
| 테마 토큰명 | CSS 변수명 | Tailwind 유틸리티 예시 | 비고 |
| :--- | :--- | :--- | :--- |
| **Primary** | `--persona-primary` | `bg-persona-primary`, `text-persona-primary` | 페르소나 주조색 |
| **Background** | `--persona-bg` | `bg-persona-bg` | 페르소나 전용 부드러운 배경색 |
| **Surface** | `--persona-surface` | `bg-persona-surface` | 카드/시트 등의 내부 배경색 |
| **Text** | `--persona-text` | `text-persona-text` | 페르소나 무드 특화 텍스트색 |
| **Muted** | `--persona-muted` | `text-persona-muted` | 페르소나 무드 특화 보조 텍스트 |
| **Radius** | `--persona-radius` | `rounded-persona` | 테마의 둥글기 조절 토큰 |
| **Display Font** | `--persona-font-display` | `font-persona-display` | 강조 제목에 적용되는 페르소나 폰트 |

### 테마 클래스 상세 (Theme Classes)
- **`theme-masil` (기본 테마)**: 친근/가족/체험 대상. 따뜻한 코랄 컬러, 둥근 UI(`1.25rem` radius), 직관적이고 밝은 에너지 부여.
- **`theme-meomulm`**: 감성/워케이션/청년 대상. 미니멀한 차콜과 정돈된 쿨 그레이 배경.
- **`theme-haengrang`**: 전통/프리미엄/환대 대상. 중후한 우드/베이지 무드, 절제된 라운드(`0.375rem`), 명조(Serif) 계열 강조 폰트 조합.
- **`theme-local`**: 활기찬 로컬 감성. 산뜻하고 밝은 그린 컬러, 친근하지만 단정한 디자인.

### ⚠️ 개발 시 주의사항 및 제약 조건
1. **shadcn/ui 토큰 보존**: 기존의 `--color-background`, `--color-foreground`, `--color-border` 등의 shadcn/ui 변수는 절대 삭제하거나 오버라이트하여 빌드를 깨뜨려서는 안 됩니다.
2. **카테고리 고유 색상 공존**: 상품 분류를 시각적으로 인지하게 하는 기존 4종의 카테고리 변수(`--category-stay` 등)는 페르소나 테마와 병렬로 유지되며, 독립적인 의미론적 역할을 갖습니다.
3. **Dark Mode 동기화**: 모든 페르소나 테마 클래스는 `:is(.dark .theme-xxx, .dark.theme-xxx)` 셀렉터를 통해 다크 모드 대응 토큰 값을 갖추고 있으므로, 라이트/다크 대응 시에도 같은 엘리먼트 또는 상위 엘리먼트의 `.dark` class를 모두 처리합니다.

## 9. 다국어 및 페르소나 문구 치환 시스템 (Persona Localization / i18n)

T-044 이후 테마 변환 뿐 아니라 문구(Copywriting) 자체가 선택한 페르소나(테마)와 언어(Locale)의 조합에 의해 동적으로 분기되는 **Persona Dictionary System**이 구축되었습니다.

### 문구 선택 우선순위 및 Resolver (Resolution Priority)
1. **1순위**: 사용자가 명시적으로 선택한 `Language + Theme`에 완전히 일치하는 Dictionary (예: 한국어 + `masil` -> `ko-masil`)
2. **2순위**: 해당 언어의 기본 변형(Base Variant) (예: 영어 + `masil` -> `en-us`)
3. **3순위 (최종 Fallback)**: `ko-masil` (절대 경로로 데이터 누락 방지)

### 필수 Dictionary 파일 구조 (`src/locales/`)
총 10종의 JSON 사전을 통해 테마별 매핑을 분기합니다.
- **한국어**: `ko-masil`, `ko-haengrang`, `ko-meomulm`, `ko-local`
- **영어**: `en-us` (기본/Masil), `en-us-zen` (Haengrang/Zen)
- **중국어**: `zh-cn`, `zh-cn-zen`
- **일본어**: `ja-jp`, `ja-jp-zen`

### 사용 가이드 (Client Hook: `usePersonaCopy`)
클라이언트 컴포넌트 내부에서 아래의 훅을 호출하여 다국어에 안전한 하이드레이션 방어형 문구 사전을 획득합니다.

```typescript
import { usePersonaCopy } from "@/hooks/use-persona-copy";

const copy = usePersonaCopy();

// JSX 렌더링 예시
return (
  <h1>{copy.hero.title}</h1>
  <p>{copy.nav.stay}</p>
);
```
*⚠️ 주의사항: 데이터베이스 기반 컨텐츠(숙소 이름, 상품 타이틀 등)와 어드민 대시보드는 번역 대상에서 제외되며, 공개 화면의 인터페이스 껍데기(GNB, Footer, 섹션 해더, CTA)만을 치환합니다.*

## 10. 첫 방문 페르소나 온보딩 시스템 (First-Visit Onboarding UX)

T-045 이후, 신규 방문자가 본인의 여행 취향에 부합하는 페르소나를 직접 제안받고 선택할 수 있는 온보딩 설문 대화상자(Dialog) 체계가 구축되었습니다.

### 동작 매커니즘 (Mechanism)
- **트리거 조건**: `hasCompletedOnboarding` 값이 `false`일 때 공개 화면 첫 접속 시 즉각 팝업됩니다.
- **localStorage 영속 상태**: `sowon-persona-storage` 내 `hasCompletedOnboarding` 플래그 필드로 영구 트래킹됩니다.
- **관리자 제외 정책**: `/admin` 하위의 모든 어드민 및 어드민 로그인 페이지에서는 해당 모달 팝업 출력이 강력하게 차단됩니다.

### UI 접근성 및 사용자 경험 (UX/A11y)
- **스크롤 락**: 모달 오버레이 활성 시 본문(body)의 레이아웃 밀림 현상 및 배경 스크롤링이 완벽하게 차단됩니다.
- **키보드 트래핑**: 모달 내 탭(TAB) 이동을 지원하며 `ESC` 키 또는 배경 클릭으로 닫을 경우 “나중에 선택”과 동일하게 기본 테마 유지 및 온보딩 완료 처리합니다.
- **재진입점 제공**: GNB 언어/통화/테마 메뉴 하단부에 **"취향 테스트 다시 받기"** 배너를 영속 노출하여, 유저가 원할 때는 언제든 온보딩 설문지로 재진입(Reset)할 수 있는 편의성을 제공합니다.

## 11. 페르소나별 콘텐츠 큐레이션 및 정렬 규칙 (Persona Content Curation)

T-046 이후, AI 없이도 고도의 개인화를 체감할 수 있는 **규칙 기반 정렬 알고리즘(Rule-based Stable Sorting)**이 콘텐츠 전체 스택에 적용되었습니다.

### 핵심 설계 원칙 (Core Principles)
- **AI 의존 제거**: API 통신 지연이나 외부 장애 리스크 없이 클라이언트 사이드에서 즉각 정렬을 완수합니다.
- **데이터 안전성**: 원본 조회 쿼리(`status=published`, `regionId=sowon`) 및 개수는 불변하며 노출 순위만 변경됩니다.
- **안전한 하이드레이션**: SSR 단계에서는 기본값(`masil` 정렬)으로 출력하고, 클라이언트 전환 후 `useSyncExternalStore` 기반 client snapshot을 통해 유저 취향에 실시간 반응합니다.

### 정렬 규칙 매커니즘 (Curation Map)
각 페르소나에 부여된 고유 가중치 키워드가 타이틀, 요약설명 등에 많이 중첩될수록 상위 노출합니다.
- **masil (체험/가족)**: `가족`, `아이`, `갯벌`, `체험`, `마을` 등 / 섹션 우선순위: 체험 > 상품 > 숙소 > 코스
- **haengrang (정갈/전통)**: `한옥`, `정갈`, `전통`, `쉼`, `고택` 등 / 섹션 우선순위: 숙소 > 상품 > 코스 > 체험
- **meomulm (감성/워케이션)**: `감성`, `바다`, `노을`, `워케이션` 등 / 섹션 우선순위: 숙소 > 코스 > 체험 > 상품
- **local (주민/로컬)**: `주민`, `어촌`, `밥상`, `장터`, `로컬` 등 / 섹션 우선순위: 상품 > 체험 > 코스 > 숙소

### 정렬 적용 범위 및 UI 안내
- **홈 화면**: 4개 카드 슬라이더의 아이템 순서 재배치와 함께 섹션 순위 전체가 동적으로 셔플링됩니다.
- **4대 목록**: 숙소, 체험, 주민소득상품, 여정의 기록 전체 그리드에 즉시 적용됩니다.
- **큐레이션 배너**: 사용자 경험을 높이기 위해 각 목록 최상단에 아주 작고 세련된 전용 마킹 배너(`✨ 여행 취향에 어울리는 ... 먼저 추천해드려요`)를 제공합니다.
