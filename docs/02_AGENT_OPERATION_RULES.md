# Agent Operation Rules

## 코드 작성 원칙
- **TypeScript 우선**: 타입 안전성을 최우선으로 하며 `any` 사용을 지양한다.
- **Tailwind CSS**: 인라인 스타일보다는 Tailwind 유틸리티 클래스를 사용한다.
- **shadcn/ui**: 검증된 UI 컴포넌트를 우선 활용한다.
- **모바일 우선(Mobile-First)**: 모든 UI는 모바일 대응을 기본으로 한다.

## 협업 및 작업 방식
- **티켓 단위 작업**: 지정된 티켓 범위 내에서만 구현하며 오버엔지니어링을 피한다.
- **문서 동기화**: 주요 아키텍처나 스키마 변경 시 관련 문서를 즉시 업데이트한다.
- **Clean Code**: 읽기 쉽고 유지보수가 용이한 코드를 작성한다.

## 보안·환경변수 운영 규칙
- 실제 secret, API key, 관리자 비밀번호는 코드·문서·seed에 작성하지 않는다.
- `.env.example`에는 예시값만 두고, 실제 값은 `.env.local` 또는 배포 환경변수에 둔다.
- `NEXT_PUBLIC_` 접두사는 브라우저 번들에 노출되므로 secret에 사용하지 않는다.
- 관리자 Server Action의 mutation 함수는 렌더링 보호와 별개로 `requireAdminSession()`을 직접 호출한다.
- 공개 API는 개인정보 동의, 필수값, enum, 문자열 길이를 서버에서 검증한다.
- 문의/입점신청 저장 실패는 실패 응답으로 처리하고, LeadEvent 저장 실패만 best-effort로 처리한다.
- MVP에서는 Google Maps/OpenAI 등 외부 API 실제 연동을 추가하지 않는다.
