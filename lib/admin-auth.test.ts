import {
  createAdminSessionCookie,
  createAdminSessionValue,
  isAdminPasswordValid,
  verifyAdminSessionValue,
} from "./admin-auth";

describe("admin-auth", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.CONTENT_ADMIN_PASSWORD = "correct-password";
    process.env.CONTENT_ADMIN_SESSION_SECRET = "session-secret";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("validates the configured admin password", () => {
    expect(isAdminPasswordValid("correct-password")).toBe(true);
    expect(isAdminPasswordValid("wrong-password")).toBe(false);
  });

  it("rejects password checks when no admin password is configured", () => {
    delete process.env.CONTENT_ADMIN_PASSWORD;

    expect(isAdminPasswordValid("correct-password")).toBe(false);
  });

  it("creates a signed session value that can be verified", () => {
    const session = createAdminSessionValue(1_800_000_000_000);

    expect(verifyAdminSessionValue(session, 1_800_000_000_001)).toBe(true);
  });

  it("rejects tampered session values", () => {
    const session = createAdminSessionValue(1_800_000_000_000);
    const tampered = session.replace(/\.[^.]+$/, ".tampered");

    expect(verifyAdminSessionValue(tampered, 1_800_000_000_001)).toBe(false);
  });

  it("rejects expired session values", () => {
    const session = createAdminSessionValue(1_800_000_000_000);

    expect(verifyAdminSessionValue(session, 1_800_086_400_001)).toBe(false);
  });

  it("builds an HttpOnly cookie for the session", () => {
    const cookie = createAdminSessionCookie("session-value");

    expect(cookie).toContain("portfolio_admin_session=session-value");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");
    expect(cookie).toContain("Path=/");
  });
});
