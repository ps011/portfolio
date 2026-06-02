import {
  buildCloudinaryRawUrl,
  uploadJsonToCloudinary,
} from "./cloudinary-content";

describe("cloudinary-content", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.CLOUDINARY_CLOUD_NAME = "demo-cloud";
    process.env.CLOUDINARY_API_KEY = "api-key";
    process.env.CLOUDINARY_API_SECRET = "api-secret";
    process.env.CONTENT_CLOUDINARY_FOLDER = "portfolio-content";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        secure_url:
          "https://res.cloudinary.com/demo-cloud/raw/upload/portfolio-content/about.json",
      }),
      text: async () => "",
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("builds the versionless raw delivery URL for a content file", () => {
    expect(buildCloudinaryRawUrl("about.json")).toBe(
      "https://res.cloudinary.com/demo-cloud/raw/upload/portfolio-content/about.json",
    );
  });

  it("uploads JSON as a raw Cloudinary asset with overwrite enabled", async () => {
    await uploadJsonToCloudinary("about.json", { name: "Prasheel" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.cloudinary.com/v1_1/demo-cloud/raw/upload",
      expect.objectContaining({
        method: "POST",
      }),
    );

    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = init.body as FormData;
    expect(body.get("public_id")).toBe("portfolio-content/about.json");
    expect(body.get("overwrite")).toBe("true");
    expect(body.get("invalidate")).toBe("true");
  });

  it("throws when Cloudinary credentials are missing", async () => {
    delete process.env.CLOUDINARY_API_SECRET;

    await expect(uploadJsonToCloudinary("about.json", {})).rejects.toThrow(
      "Missing Cloudinary configuration",
    );
  });
});
