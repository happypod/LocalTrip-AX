#!/usr/bin/env node

const PUBLIC_ROUTES = [
  "/",
  "/stays",
  "/experiences",
  "/programs",
  "/courses",
  "/events",
  "/map",
  "/partner/apply",
  "/partner/premium-pr",
  "/customer-center",
  "/my",
  "/course-builder",
];

const ADMIN_REDIRECT_ROUTES = ["/admin", "/admin/stays", "/admin/inquiries"];

const API_NEGATIVE_TESTS = [
  "/api/inquiries",
  "/api/partner-applications",
  "/api/premium-pr-applications",
];

const OPTIONAL_API_NEGATIVE_TESTS = ["/api/lead-events"];

const DEFAULT_BASE_URL = "http://localhost:3000";
const SLOW_MS = readPositiveInt("SMOKE_SLOW_MS", 5000);
const TIMEOUT_MS = readPositiveInt("SMOKE_TIMEOUT_MS", 15000);
const baseUrl = normalizeBaseUrl(
  process.env.SMOKE_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_BASE_URL,
);

const totals = {
  passed: 0,
  warned: 0,
  failed: 0,
};

function readPositiveInt(name, fallback) {
  const raw = process.env[name];

  if (!raw) {
    return fallback;
  }

  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function normalizeBaseUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    console.error(`[FAIL] Invalid smoke test base URL: ${rawUrl}`);
    process.exit(1);
  }
}

function toUrl(path) {
  return new URL(path, baseUrl).toString();
}

function formatError(error) {
  if (error?.name === "AbortError") {
    return `timeout after ${TIMEOUT_MS}ms`;
  }

  return error?.message || String(error);
}

function elapsedSince(startedAt) {
  return Math.round(performance.now() - startedAt);
}

async function request(path, init = {}) {
  const controller = new AbortController();
  const startedAt = performance.now();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(toUrl(path), {
      ...init,
      signal: controller.signal,
      headers: {
        "user-agent": "LocalTripAX-SmokeTest/1.0",
        ...(init.headers || {}),
      },
    });

    return {
      response,
      ms: elapsedSince(startedAt),
    };
  } catch (error) {
    return {
      error,
      ms: elapsedSince(startedAt),
    };
  } finally {
    clearTimeout(timer);
  }
}

function pass(message) {
  totals.passed += 1;
  console.log(`[PASS] ${message}`);
}

function warn(message) {
  totals.warned += 1;
  console.warn(`[WARN] ${message}`);
}

function fail(message) {
  totals.failed += 1;
  console.error(`[FAIL] ${message}`);
}

function warnIfSlow(method, path, ms) {
  if (ms > SLOW_MS) {
    warn(`${method} ${path} slow ${ms}ms`);
  }
}

function locationPath(location) {
  if (!location) {
    return "";
  }

  try {
    return new URL(location, baseUrl).pathname;
  } catch {
    return location;
  }
}

async function readJsonSafe(response) {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

async function checkPublicRoute(path) {
  const { response, error, ms } = await request(path);

  if (error) {
    fail(`GET ${path} ${formatError(error)} ${ms}ms`);
    return;
  }

  if (response.status === 200) {
    pass(`GET ${path} ${response.status} ${ms}ms`);
  } else {
    fail(`GET ${path} ${response.status} ${ms}ms`);
  }

  warnIfSlow("GET", path, ms);
}

async function checkAdminRedirect(path) {
  const { response, error, ms } = await request(path, {
    redirect: "manual",
  });

  if (error) {
    fail(`REDIRECT ${path} ${formatError(error)} ${ms}ms`);
    return;
  }

  const redirectStatuses = new Set([302, 303, 307, 308]);
  const location = response.headers.get("location");
  const targetPath = locationPath(location);

  if (redirectStatuses.has(response.status) && targetPath === "/admin/login") {
    pass(`REDIRECT ${path} -> ${targetPath} ${response.status} ${ms}ms`);
  } else {
    fail(
      `REDIRECT ${path} expected /admin/login, got ${response.status} ${location || "(no location)"} ${ms}ms`,
    );
  }

  warnIfSlow("REDIRECT", path, ms);
}

async function checkApiNegative(path) {
  const { response, error, ms } = await request(path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "{}",
  });

  if (error) {
    fail(`POST ${path} ${formatError(error)} ${ms}ms`);
    return;
  }

  const acceptedStatuses = new Set([400, 422, 429]);

  if (acceptedStatuses.has(response.status)) {
    pass(`POST ${path} rejected ${response.status} ${ms}ms`);
  } else {
    const body = await readJsonSafe(response);
    fail(
      `POST ${path} expected validation rejection, got ${response.status} ${JSON.stringify(body)} ${ms}ms`,
    );
  }

  warnIfSlow("POST", path, ms);
}

async function checkOptionalApiNegative(path) {
  const { response, error, ms } = await request(path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "{}",
  });

  if (error) {
    warn(`POST ${path} optional check skipped: ${formatError(error)} ${ms}ms`);
    return;
  }

  const acceptedStatuses = new Set([400, 422, 429]);

  if (acceptedStatuses.has(response.status)) {
    pass(`POST ${path} rejected ${response.status} ${ms}ms`);
  } else {
    const body = await readJsonSafe(response);
    warn(
      `POST ${path} returned ${response.status}; LeadEvent is best-effort, response=${JSON.stringify(body)} ${ms}ms`,
    );
  }

  warnIfSlow("POST", path, ms);
}

async function main() {
  console.log(`Smoke test base URL: ${baseUrl.origin}`);
  console.log(`Timeout: ${TIMEOUT_MS}ms, slow threshold: ${SLOW_MS}ms`);

  for (const path of PUBLIC_ROUTES) {
    await checkPublicRoute(path);
  }

  for (const path of ADMIN_REDIRECT_ROUTES) {
    await checkAdminRedirect(path);
  }

  for (const path of API_NEGATIVE_TESTS) {
    await checkApiNegative(path);
  }

  for (const path of OPTIONAL_API_NEGATIVE_TESTS) {
    await checkOptionalApiNegative(path);
  }

  console.log(
    `Smoke test completed: ${totals.passed} passed, ${totals.warned} warned, ${totals.failed} failed`,
  );

  if (totals.failed > 0) {
    process.exit(1);
  }
}

await main();
