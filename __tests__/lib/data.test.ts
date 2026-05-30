import { getSiteData, getAboutData, getBlogs, getBlogByLink, getGalleryItems } from "../../lib/data";

const KEKU_POST_URL =
  "https://ps11.hashnode.dev/i-built-a-robot-crab-named-keku-here-s-everything-that-went-wrong-and-right";
const KEKU_BANNER_URL =
  "https://res.cloudinary.com/designu/image/upload/v1780126242/Banners/aa3797fd-674f-4225-b7ab-47e171791523.png";
const BUDAPEST_PHOTO_URLS = [
  "https://res.cloudinary.com/designu/image/upload/v1780128476/Photo%20Gallery/Budapest/PXL_20260221_184503196.jpg",
  "https://res.cloudinary.com/designu/image/upload/v1780128471/Photo%20Gallery/Budapest/PXL_20260220_152945079_2.jpg",
  "https://res.cloudinary.com/designu/image/upload/v1780128471/Photo%20Gallery/Budapest/IMG_3182.jpg",
  "https://res.cloudinary.com/designu/image/upload/v1780128469/Photo%20Gallery/Budapest/PXL_20260222_113133273_2.jpg",
  "https://res.cloudinary.com/designu/image/upload/v1780128468/Photo%20Gallery/Budapest/PXL_20260223_104933408.jpg",
];

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
      expect(data.imageUrl).toBeDefined();
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

    it("includes the exchange rate calculator as a visible experiment", async () => {
      const blogs = await getBlogs();
      const experiment = blogs.find(
        (blog) => blog.link === "https://exchange-rates-delta.vercel.app/",
      );

      expect(experiment).toMatchObject({
        title: "Exchange Rate Calculator",
        shortDescription: "An exchange rate calculator app built by me.",
        hidden: false,
        type: "experiments",
      });
    });

    it("includes the Keku robot crab post as a visible experiment", async () => {
      const blogs = await getBlogs();
      const experiment = blogs.find(
        (blog) => blog.link === KEKU_POST_URL,
      );

      expect(experiment).toMatchObject({
        title: "I Built a Robot Crab Named Keku",
        thumbnail: KEKU_BANNER_URL,
        hidden: false,
        type: "experiments",
      });
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

    it("includes banner metadata for the Keku robot crab post", async () => {
      const blog = await getBlogByLink(KEKU_POST_URL);

      expect(blog).toMatchObject({
        title: "I Built a Robot Crab Named Keku",
        banner: KEKU_BANNER_URL,
        thumbnail: KEKU_BANNER_URL,
      });
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

    it("includes the Budapest photo album", async () => {
      const items = await getGalleryItems();
      const budapestItems = items.filter((item) => item.category === "Hungary");

      expect(budapestItems).toHaveLength(BUDAPEST_PHOTO_URLS.length);
      expect(budapestItems.map((item) => item.id)).toEqual([
        "Hungary-0",
        "Hungary-1",
        "Hungary-2",
        "Hungary-3",
        "Hungary-4",
      ]);
      expect(budapestItems.map((item) => item.location)).toEqual(
        Array(BUDAPEST_PHOTO_URLS.length).fill("Budapest"),
      );
      expect(budapestItems.map((item) => item.src)).toEqual(BUDAPEST_PHOTO_URLS);
      expect(budapestItems.map((item) => item.thumb)).toEqual(BUDAPEST_PHOTO_URLS);
    });
  });

});
