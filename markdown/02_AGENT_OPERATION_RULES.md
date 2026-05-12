# 02_AGENT_OPERATION_RULES.md

## 운영 원칙

본 프로젝트는 AntiGraffiti와 Codex를 병행 운용한다.

AntiGraffiti는 구현 중심, Codex는 설계·검토·QA 중심이다.

---

## AntiGraffiti 사용 기준

### 기본 사용 모델

- Gemini 3 Flash

사용 대상:

1. 일반 UI 구현
2. 단순 CRUD
3. 컴포넌트 생성
4. Tailwind 스타일링
5. 목록·상세 페이지 구현
6. 간단한 API route 구현
7. seed data 작성
8. 문구 수정
9. 반응형 개선

---

### Gemini 3.1 Pro High 사용 기준

아래 작업은 Gemini 3.1 Pro High로 상향한다.

1. Prisma schema 설계 또는 대규모 수정
2. 권한 구조 설계
3. Region 기반 다지역 구조 설계
4. 관리자 대시보드 구조 설계
5. 지도 API 연동
6. LeadEvent 추적 구조 설계
7. 예약요청 구조 설계
8. 교육·인증 구조 설계
9. API DTO 구조 설계
10. 복수 도메인 확장 구조 설계

---

### Claude Sonnet 4.6 Thinking 사용 기준

아래 작업은 Claude Sonnet 4.6 Thinking을 사용한다.

1. 반복 빌드 오류 해결
2. TypeScript 타입 충돌 해결
3. Next.js App Router 구조 오류 해결
4. Prisma migration 오류 해결
5. UI 상태관리 리팩토링
6. 컴포넌트 분해
7. 복잡한 모바일 레이아웃 개선
8. 지도 컴포넌트 오류 해결
9. 성능 저하 원인 분석
10. 배포 오류 분석

---

## Codex 사용 기준

### 기본 사용 모델

- GPT-5.5 매우 높음

Codex는 다음 작업을 수행한다.

1. 티켓별 요구사항 검토
2. 구현 전 설계 점검
3. 구현 후 코드 리뷰
4. 테스트 케이스 작성
5. QA 체크리스트 작성
6. 데이터 모델 검증
7. 보안·권한 리스크 검토
8. AX 확장 가능성 검토
9. 리팩토링 지시문 작성
10. 다음 티켓 작업 순서 조정

---

## 작업 순서

각 티켓은 다음 순서로 진행한다.

1. Codex가 티켓 요구사항과 수용기준을 정리한다.
2. AntiGraffiti가 구현한다.
3. AntiGraffiti가 변경 파일과 테스트 방법을 보고한다.
4. Codex가 결과물을 검토한다.
5. 필요한 경우 AntiGraffiti가 수정한다.
6. 티켓을 완료 처리한다.

---

## 티켓 완료 기준

각 티켓은 아래 항목을 만족해야 완료된다.

1. 빌드 오류 없음
2. TypeScript 오류 없음
3. 모바일 화면 깨짐 없음
4. 핵심 기능 동작
5. 관리자 화면에서 데이터 관리 가능
6. API 응답 구조 일관성 유지
7. 추후 확장 가능한 네이밍 사용
8. 변경사항 문서화