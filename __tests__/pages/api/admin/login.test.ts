import handler from "../../../../pages/api/admin/login";

function createResponse() {
  const response: any = {
    headers: {},
    statusCode: 200,
  };

  response.setHeader = jest.fn((name: string, value: string) => {
    response.headers[name.toLowerCase()] = value;
  });
  response.status = jest.fn((statusCode: number) => {
    response.statusCode = statusCode;
    return response;
  });
  response.json = jest.fn((body: unknown) => {
    response.body = body;
    return response;
  });
  response.end = jest.fn(() => response);

  return response;
}

describe("/api/admin/login", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.CONTENT_ADMIN_PASSWORD = "correct-password";
    process.env.CONTENT_ADMIN_SESSION_SECRET = "session-secret";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sets an admin session cookie for the correct password", async () => {
    const response = createResponse();

    await handler(
      {
        method: "POST",
        body: { password: "correct-password" },
      } as any,
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toContain("portfolio_admin_session=");
    expect(response.headers["set-cookie"]).toContain("HttpOnly");
    expect(response.body).toEqual({ authenticated: true });
  });

  it("rejects an incorrect password", async () => {
    const response = createResponse();

    await handler(
      {
        method: "POST",
        body: { password: "wrong-password" },
      } as any,
      response,
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Invalid password" });
  });
});
