export class PublicApiValidationError extends Error {
  status: number;
  code: string;

  constructor(code = "INVALID_INPUT", status = 400) {
    super(code);
    this.name = "PublicApiValidationError";
    this.code = code;
    this.status = status;
  }
}

export function isPublicApiValidationError(error: unknown): error is PublicApiValidationError {
  return error instanceof PublicApiValidationError;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonRecord(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    throw new PublicApiValidationError("INVALID_JSON", 400);
  }

  if (!isRecord(body)) {
    throw new PublicApiValidationError("INVALID_INPUT", 400);
  }

  return body;
}

type StringFieldOptions = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  code?: string;
};

export function readStringField(
  body: Record<string, unknown>,
  key: string,
  options: StringFieldOptions & { required: true },
): string;
export function readStringField(
  body: Record<string, unknown>,
  key: string,
  options?: StringFieldOptions,
): string | null;
export function readStringField(
  body: Record<string, unknown>,
  key: string,
  options: StringFieldOptions = {},
) {
  const raw = body[key];

  if (raw === undefined || raw === null || raw === "") {
    if (options.required) {
      throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
    }
    return null;
  }

  if (typeof raw !== "string") {
    throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
  }

  const value = raw.trim();

  if (!value) {
    if (options.required) {
      throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
    }
    return null;
  }

  if (options.min !== undefined && value.length < options.min) {
    throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
  }

  if (options.max !== undefined && value.length > options.max) {
    throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
  }

  if (options.pattern && !options.pattern.test(value)) {
    throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
  }

  return value;
}

export function readBooleanField(body: Record<string, unknown>, key: string) {
  return body[key] === true;
}

export function readEnumField<const T extends readonly string[]>(
  body: Record<string, unknown>,
  key: string,
  allowedValues: T,
  options: { required: true; defaultValue?: T[number]; code?: string },
): T[number];
export function readEnumField<const T extends readonly string[]>(
  body: Record<string, unknown>,
  key: string,
  allowedValues: T,
  options: { required?: boolean; defaultValue: T[number]; code?: string },
): T[number];
export function readEnumField<const T extends readonly string[]>(
  body: Record<string, unknown>,
  key: string,
  allowedValues: T,
  options?: { required?: boolean; defaultValue?: T[number]; code?: string },
): T[number] | null;
export function readEnumField<const T extends readonly string[]>(
  body: Record<string, unknown>,
  key: string,
  allowedValues: T,
  options: { required?: boolean; defaultValue?: T[number]; code?: string } = {},
) {
  const value = readStringField(body, key, {
    required: options.required,
    max: 80,
    code: options.code,
  });

  if (!value) {
    return options.defaultValue ?? null;
  }

  if (!allowedValues.includes(value)) {
    throw new PublicApiValidationError(options.code ?? "INVALID_INPUT", 400);
  }

  return value as T[number];
}
