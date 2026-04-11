import { getSiteData, getAboutData, getBlogs, getBlogByLink, getGalleryItems, getUIConfig } from "../../lib/data";

describe("lib/data", () => {
  describe("getSiteData", () => {
    it("returns site data from data/site.json", async () => {
      const data = await getSiteData();
      expect(data).toBeDefined();
      expect(data.header).toBeDefined();
      expect(data.header.logoUrl).toBeDefined();
      expect(data.meta).toBeDefined();
      expect(data.banner).toBeDefined();
    });
  });

  describe("getAboutData", () => {
    it("returns about data from data/about.json", async () => {
      const data = await getAboutData();
      expect(data).toBeDefined();
      expect(data.name).toBe("Prasheel");
      expect(data.skills).toBeDefined();
      expect(Array.isArray(data.skills)).toBe(true);
      expect(data.profiles).toBeDefined();
    });
  });

  describe("getBlogs", () => {
    it("returns array of BlogCard objects", async () => {
      const blogs = await getBlogs();
      expect(Array.isArray(blogs)).toBe(true);
      expect(blogs.length).toBeGreaterThan(0);
      const first = blogs[0];
      expect(first).toHaveProperty("title");
      expect(first).toHaveProperty("shortDescription");
      expect(first).toHaveProperty("link");
      expect(first).toHaveProperty("hidden");
    });
  });

  describe("getBlogByLink", () => {
    it("returns blog matching the given link slug", async () => {
      const blog = await getBlogByLink("a-weekend-in-udaipur");
      expect(blog).not.toBeNull();
      expect(blog!.title).toBe("Udaipur");
      expect(blog!.content).toContain("https://res.cloudinary.com");
    });

    it("returns null for non-existent link", async () => {
      const blog = await getBlogByLink("does-not-exist");
      expect(blog).toBeNull();
    });
  });

  describe("getGalleryItems", () => {
    it("returns flat array of GalleryImage objects", async () => {
      const items = await getGalleryItems();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      const first = items[0];
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("src");
      expect(first).toHaveProperty("category");
    });
  });

  describe("getUIConfig", () => {
    it("returns UIConfig from data/ui.json", async () => {
      const config = await getUIConfig();
      expect(config).toBeDefined();
      expect(config.banner.greeting).toBeDefined();
      expect(config.footer.heading).toBeDefined();
    });
  });
});
