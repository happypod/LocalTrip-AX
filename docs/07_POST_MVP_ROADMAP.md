# Post-MVP Roadmap

MVP는 T-001~T-028 기준으로 완료된 상태다. 이후 작업은 MVP 범위가 아니라 출시 전 운영 점검과 Post-MVP 고도화로 분리한다.

상세 티켓 정의는 [13_POST_MVP_TICKETS.md](./13_POST_MVP_TICKETS.md)를 기준 문서로 사용한다.

## Phase 1: 출시 전 운영 점검

- Production DB schema 적용 여부 결정
- 운영 초기 seed 데이터 적용 여부 결정
- 관리자 계정 및 secret rotation
- Production smoke test
- 모바일/PC viewport QA 및 실제 기기 후속 QA
- 공개 데이터 노출 QA
- 개인정보/문의/입점신청 QA
- 이미지 및 fallback QA
- 지도 placeholder QA
- 접근성 기본 QA
- 운영 도메인 연결 여부 결정
- 출시 승인 체크리스트 작성

## Phase 2: 페르소나 테마 / i18n 1차 고도화

- 4개 페르소나 테마 정의
  - `masil`: 소원마실, 친근/가족/체험
  - `haengrang`: 소원행랑, 전통/프리미엄/환대
  - `meomulm`: 소원머묾, 감성/워케이션/미니멀
  - `local`: 충청도 바이브, 이스터에그
- 한국어/영어/중국어 간체/일본어 dictionary pack 추가
- React Context + localStorage 기반 전역 theme/language/currency 상태 구현
- body class 기반 CSS theme token 적용
- 전역 네비와 홈 hero/section/badge/button 문구 1차 dictionary 적용
- 첫 방문 온보딩 및 테마 선택 UI 구현

## Phase 3: 운영 기능 고도화

- 실제 지도 API 연동 및 위치 데이터 정규화
- 이벤트를 실제 운영 콘텐츠로 사용할 경우 `Event.regionId`, 공개 `/events` 조회, 관리자 이벤트 CRUD 검증 정비
- 이미지 최적화 및 `next/image` 전환
- 접근성 QA 자동화
- 운영 로그 및 오류 모니터링
- Prisma migration 전략 정리
- 관리자 권한 세분화 및 audit log
- 공개 화면 draft/inactive 비노출 자동화 테스트

## Phase 4: B2B Premium PR / 콘텐츠 제작대행 BM

- 숙소별 프리미엄 PR 옵션 저장 구조 추가
  - Prisma `Json` 필드 기반 `premiumPr`
  - PostgreSQL/Supabase 환경에서는 JSONB 저장 전제
- 숙소 상세 안에서 VR/3D 투어, 호스트 영상, 드론 영상 조건부 노출
- 관리자 숙소 폼에서 프리미엄 PR URL과 노출 상태 관리
- 프리미엄 콘텐츠 클릭을 `LeadEvent`로 수집
- 업주용 콘텐츠 제작대행 상담 신청 폼 추가
- 현장센터/지역 활동가 기반 제작 workflow 문서화
- 결제, 정산, 예약 확정은 이 단계에서도 자동화하지 않고 문의/운영 관리까지만 구현

## Phase 5: AX 인공지능 기반 고도화

- 실제 AI API 연동: OpenAI / Gemini API 연동을 통한 콘텐츠 보강 및 가공 지원
- AI 홍보 카피라이팅: 인스타그램 피드, 카카오 채널, 블로그 최적화 카피 자동 생성
- AI 지능형 운영 진단: `LeadEvent` 수집 추이를 분석해 클릭 대비 이탈률 개선 가이드 제안
- 추천 코스 자동 생성 및 운영자 승인 workflow

## 계속 유지할 제외 원칙

- 결제, 정산, 실시간 예약 확정, 차량 운송, 후기, 쿠폰, 포인트는 MVP 이후 별도 사업 검토 전까지 임의 구현하지 않는다.
- B2B Premium PR 단계에서도 결제/정산 자동화는 구현하지 않고, 제작대행 신청과 운영자 상태 관리까지만 다룬다.
- 실제 지도/AI API는 별도 티켓과 비용/운영 승인 없이 연결하지 않는다.
- `LocalIncomeProgram`은 `Experience`에 흡수하지 않는다.
