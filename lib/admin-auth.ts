import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24;

function getAdminPassword() {
  return process.env.CONTENT_ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return process.env.CONTENT_ADMIN_SESSION_SECRET || getAdminPassword();
}

function sign(value: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Missing admin session secret");
  }
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function isAdminPasswordValid(password: string) {
  const expected = getAdminPassword();
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

export function createAdminSessionValue(now = Date.now()) {
  const expiresAt = now + ADMIN_SESSION_TTL_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionValue(value: string | undefined, now = Date.now()) {
  if (!value) return false;

  const [expiresAtRaw, signature] = value.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;

  try {
    return safeEqual(signature, sign(expiresAtRaw));
  } catch {
    return false;
  }
}

export function createAdminSessionCookie(sessionValue: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(sessionValue)}`,
    `Max-Age=${ADMIN_SESSION_TTL_SECONDS}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
  ].join("; ") + secure;
}

export function createAdminLogoutCookie() {
  return [
    `${ADMIN_SESSION_COOKIE}=`,
    "Max-Age=0",
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
  ].join("; ");
}

export function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const prefix = `${name}=`;
  const match = cookies.find((cookie) => cookie.startsWith(prefix));
  if (!match) return undefined;

  return decodeURIComponent(match.slice(prefix.length));
}

export function isAdminRequestAuthenticated(cookieHeader: string | undefined) {
  return verifyAdminSessionValue(getCookieValue(cookieHeader, ADMIN_SESSION_COOKIE));
}
