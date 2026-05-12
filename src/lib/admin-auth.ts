import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "ltax_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

type AdminSessionPayload = {
  username: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn("[AdminAuth] ADMIN_SESSION_SECRET is not set. Using development-only fallback.");
    return "localtrip-ax-development-admin-session-secret";
  }

  return null;
}

function signSessionPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionToken(username: string) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is required for admin sessions.");
  }

  const payload: AdminSessionPayload = {
    username,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signSessionPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string) {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;

    if (typeof payload.username !== "string" || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload.username;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!session?.value) return null;

  return verifySessionToken(session.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  const token = createSessionToken(username);
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;
  
  if (!envUsername || !envPassword) {
    console.warn("[AdminAuth] ADMIN_USERNAME or ADMIN_PASSWORD not set in environment.");
    // In development, if not set, we can allow a fallback or just fail
    if (process.env.NODE_ENV === "development") {
      return username === "admin" && password === "admin";
    }
    return false;
  }
  
  return username === envUsername && password === envPassword;
}
