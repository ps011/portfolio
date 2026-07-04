import { createAdminSessionValue } from "@/lib/admin-auth";
import { readAllContentFiles, readContentFile } from "@/lib/content-source";
import { uploadJsonToCloudinary } from "@/lib/cloudinary-content";
import handler from "../../../../pages/api/admin/content";

jest.mock("@/lib/content-source", () => {
  const actual = jest.requireActual("@/lib/content-source");
  return {
    ...actual,
    readAllContentFiles: jest.fn(),
    readContentFile: jest.fn(),
  };
});

jest.mock("@/lib/cloudinary-content", () => ({
  uploadJsonToCloudinary: jest.fn(),
}));

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

describe("/api/admin/content", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.CONTENT_ADMIN_PASSWORD = "correct-password";
    process.env.CONTENT_ADMIN_SESSION_SECRET = "session-secret";
    (readAllContentFiles as jest.Mock).mockResolvedValue({
      "about.json": { location: "Tallinn" },
    });
    (readContentFile as jest.Mock).mockResolvedValue({ previous: true });
    (uploadJsonToCloudinary as jest.Mock).mockResolvedValue({
      secure_url: "https://res.cloudinary.com/demo/raw/upload/about.json",
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("requires an admin session", async () => {
    const response = createResponse();

    await handler({ method: "GET", headers: {} } as any, response);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("returns all editable content files for an authenticated request", async () => {
    const response = createResponse();
    const session = createAdminSessionValue();

    await handler(
      {
        method: "GET",
        headers: {
          cookie: `portfolio_admin_session=${encodeURIComponent(session)}`,
        },
      } as any,
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      files: ["site.json", "about.json", "blogs.json", "gallery.json"],
      content: {
        "about.json": { location: "Tallinn" },
      },
    });
  });

  it("saves validated JSON content to Cloudinary", async () => {
    const response = createResponse();
    const session = createAdminSessionValue();

    await handler(
      {
        method: "PUT",
        headers: {
          cookie: `portfolio_admin_session=${encodeURIComponent(session)}`,
        },
        body: {
          filename: "about.json",
          data: { location: "Tartu" },
        },
      } as any,
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(uploadJsonToCloudinary).toHaveBeenCalledWith(
      expect.stringMatching(/^backups\/about-/),
      { previous: true },
    );
    expect(uploadJsonToCloudinary).toHaveBeenCalledWith("about.json", {
      location: "Tartu",
    });
  });

  it("rejects unsupported file names", async () => {
    const response = createResponse();
    const session = createAdminSessionValue();

    await handler(
      {
        method: "PUT",
        headers: {
          cookie: `portfolio_admin_session=${encodeURIComponent(session)}`,
        },
        body: {
          filename: "secrets.json",
          data: {},
        },
      } as any,
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(uploadJsonToCloudinary).not.toHaveBeenCalled();
  });

  it("rejects invalid top-level content shapes", async () => {
    const response = createResponse();
    const session = createAdminSessionValue();

    await handler(
      {
        method: "PUT",
        headers: {
          cookie: `portfolio_admin_session=${encodeURIComponent(session)}`,
        },
        body: {
          filename: "blogs.json",
          data: { title: "Not an array" },
        },
      } as any,
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(uploadJsonToCloudinary).not.toHaveBeenCalled();
  });
});
