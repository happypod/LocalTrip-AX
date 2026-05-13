/**
 * Vercel Production 환경에서의 관측 가능성(Observability) 확보를 위한 최소 로깅 헬퍼
 * 
 * - 개인정보(PII) 출력 엄격히 금지 (name, email, phone, message 등)
 * - 외부 로깅 패키지(Sentry, Datadog) 없이 표준 출력을 활용하여 Vercel Logs에서 검색 가능하도록 구성
 */

export interface OperationLogMetadata {
  route?: string | null;
  operation?: string | null;
  regionId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  statusCode?: number | null;
  requestId?: string | null;
  [key: string]: unknown; // 추가 데이터 허용
}

/**
 * PII 필터링 및 민감 정보 제거 (안전망)
 */
function sanitizeMetadata(metadata?: OperationLogMetadata): Record<string, unknown> {
  if (!metadata) return {};
  
  const safeData = { ...metadata };
  // 개인정보로 간주될 수 있는 필드 삭제 (실수로 넘어올 경우 대비)
  delete safeData.name;
  delete safeData.applicantName;
  delete safeData.email;
  delete safeData.phone;
  delete safeData.message;
  delete safeData.password;
  delete safeData.token;

  return safeData;
}

export function logOperationError(eventName: string, error: unknown, metadata?: OperationLogMetadata) {
  const safeMetadata = sanitizeMetadata(metadata);
  
  const logPayload = {
    level: "ERROR",
    event: eventName,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error),
    // Prisma 에러 등의 상세 구조를 안전하게 추출
    errorCode: typeof error === "object" && error !== null && "code" in error ? error.code : undefined,
    ...safeMetadata,
  };
  
  // Vercel Logs가 JSON 포맷을 파싱할 수 있도록 한 줄 출력
  console.error(JSON.stringify(logPayload));
}

export function logOperationInfo(eventName: string, metadata?: OperationLogMetadata) {
  const safeMetadata = sanitizeMetadata(metadata);
  
  const logPayload = {
    level: "INFO",
    event: eventName,
    timestamp: new Date().toISOString(),
    ...safeMetadata,
  };
  
  console.info(JSON.stringify(logPayload));
}
