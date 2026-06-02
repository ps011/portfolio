import {
  CONTENT_FILES,
  getContentFileUrl,
  readContentFile,
} from "./content-source";

describe("content-source", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("defines the editable content files", () => {
    expect(CONTENT_FILES).toEqual(["site.json", "about.json", "blogs.json", "gallery.json"]);
  });

  it("builds content URLs from CONTENT_REMOTE_BASE_URL", () => {
    process.env.CONTENT_REMOTE_BASE_URL = "https://cdn.example.com/content/";

    expect(getContentFileUrl("about.json")).toBe(
      "https://cdn.example.com/content/about.json",
    );
  });

  it("builds content URLs from Cloudinary config when no base URL is set", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo-cloud";
    process.env.CONTENT_CLOUDINARY_FOLDER = "portfolio-content";

    expect(getContentFileUrl("gallery.json")).toBe(
      "https://res.cloudinary.com/demo-cloud/raw/upload/portfolio-content/gallery.json",
    );
  });

  it("returns null when no remote source is configured", () => {
    expect(getContentFileUrl("about.json")).toBeNull();
  });

  it("fetches and parses remote content when a URL is configured", async () => {
    process.env.CONTENT_REMOTE_BASE_URL = "https://cdn.example.com/content/";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ location: "Tallinn" }),
    });

    await expect(readContentFile("about.json")).resolves.toEqual({
      location: "Tallinn",
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://cdn.example.com/content/about.json",
      expect.objectContaining({ cache: "no-store" }),
    );
  });
});
