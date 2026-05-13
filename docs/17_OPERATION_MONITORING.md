# T-059 운영 로그/모니터링 기준 가이드

이 문서는 LocalTrip AX / 소원로컬트립 MVP의 Vercel 프로덕션 환경에서의 운영 관측성(Observability) 및 예외 처리 기준을 정의합니다.

## 1. Vercel Functions Logs 확인 절차

현재 시스템은 외부 모니터링 툴(Datadog, Sentry 등)을 사용하지 않고, 예산 최적화를 위해 Vercel의 기본 Logs 메뉴를 활용합니다. 

- **접근 경로**: `Vercel Dashboard` > `sowons-projects-e525dae5/localtrip-ax` > **Logs** 탭
- **확인 대상 환경**: `Environment: Production` 선택
- **검색 방법**:
  - 에러 필터링: 검색창에 `"level":"ERROR"` 입력
  - 이벤트별 필터링: `"event":"inquiry_save_failed"` 또는 `"event":"partner_apply_save_failed"` 검색
- **로그 포맷**: Vercel 시스템에서 JSON 객체를 더 쉽게 파싱하고 표시할 수 있도록 모든 에러 및 주요 정보는 한 줄짜리 JSON 텍스트로 로깅됩니다.

## 2. 주요 모니터링 Alert 기준 (수동/정기 점검)

당장 시스템 Alert을 자동 연동하진 않더라도, 로그를 모니터링할 때 아래 기준에 해당하면 즉시 원인을 파악해야 합니다.

| 식별 이벤트 (event name) | Alert 기준 | 대응 방법 |
|---|---|---|
| `inquiry_save_failed` | **1건 이상 발생 즉시** | 문의 유실 방지를 위해 Vercel Logs에 남은 시간/메타데이터를 확인하여 원인(DB 연결, Schema mismatch 등) 파악 |
| `partner_apply_save_failed` | **1건 이상 발생 즉시** | 입점신청 데이터 유실 방지를 위해 원인 파악 및 5xx 에러 대응 |
| `lead_event_save_failed` | **10분 내 20% 이상의 비율로 발생 시** | 사용자 흐름은 끊기지 않지만 데이터 분석 누락 발생. DB 커넥션 병목이나 이벤트 구조 변경으로 인한 Prisma 오류 확인 |
| `map_lead_event_save_failed`| **지속적으로 다수 발생 시** | 마찬가지로 분석 누락 모니터링용 |
| (관리자 로그인 실패 반복) | 동일 IP 기준 10분 내 10회 이상 | 악의적 접근 시도로 판단. (추후 Rate Limit 또는 IP 차단 검토) |
| DB 연결 실패 반복 | `PrismaClientInitializationError` 다수 | Neon Database 대시보드에서 Connection/Compute 상태 점검 |

## 3. 개인정보 로그 금지 기준 (Data Privacy)

사용자가 입력한 민감 개인정보(PII)는 Vercel Logs 및 데이터 파이프라인에 영구적으로 남아 보안 리스크가 될 수 있으므로 엄격히 로그 출력을 금지합니다.

- **출력 금지 대상**: 
  - `name` (이름)
  - `applicantName` (입점 신청자 이름)
  - `phone` (연락처)
  - `email` (이메일 주소)
  - `message` (문의 원본 텍스트)
  - DB Password, Connection String, 기타 `.env` 시크릿
- **대체 수단**: 
  - `src/lib/operation-log.ts` 내의 `sanitizeMetadata` 함수에서 위 필드들이 전달되더라도 강제로 필터링합니다. 
  - 필요한 경우, `targetType`, `regionId`, `route` 등 개인 식별이 불가능한 메타데이터만 함께 로깅하여 에러 위치를 특정합니다.

## 4. 에러 발생 시 사용자 응답 (Fail-safe Policy)

- **문의 / 입점신청 저장 실패**
  - 실패를 성공으로 위장하면 안 됩니다.
  - 내부 `logOperationError` 기록 후 클라이언트에는 HTTP 500(`INTERNAL_SERVER_ERROR`) 및 실패 응답을 반환하여, 사용자가 다시 시도하거나 고객센터로 직접 연락하도록 유도합니다.
- **LeadEvent (일반/지도) 실패**
  - 단순 통계/분석용 이벤트이므로, 저장에 실패해도 사용자의 주 기능(문의 폼 제출, 외부 링크 이동 등)을 막아서는 안 됩니다.
  - 내부 `logOperationError`를 기록하되 클라이언트에게는 HTTP 200(`ok: true`)을 응답하는 Best-effort 정책을 유지합니다.

## 5. 트러블슈팅 가이드

### DB 연결 실패 시 점검 순서
1. Neon Database 접속 후 Compute 리소스(Auto-suspend 여부 등)가 응답 중인지 확인.
2. Vercel 배포 환경 변수(`DATABASE_URL`)의 변경 여부 확인.
3. 데이터베이스 커넥션 초과(Connection Pooling) 관련 문제인지 Prisma Error Code를 통해 파악.

### 환경변수 누락 점검 순서
1. 관리자 기능 에러 시 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` 값 유효성 체크.
2. `NEXT_PUBLIC_SITE_URL` 값이 Vercel Production 도메인과 맞는지 체크 (소셜 로그인, 절대 경로 생성 등에 영향).
