type GtagWindow = Window & {
  gtag?: jest.Mock;
};

const originalNodeEnv = process.env.NODE_ENV;
const originalMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const setNodeEnv = (value: string) => {
  Object.defineProperty(process.env, "NODE_ENV", {
    value,
    configurable: true,
  });
};

const restoreMeasurementId = () => {
  if (originalMeasurementId === undefined) {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    return;
  }
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalMeasurementId;
};

const loadGtag = () => {
  jest.resetModules();
  return require("./gtag");
};

describe("gtag analytics helpers", () => {
  beforeEach(() => {
    setNodeEnv("production");
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    (window as GtagWindow).gtag = jest.fn();
  });

  afterEach(() => {
    setNodeEnv(originalNodeEnv);
    restoreMeasurementId();
    delete (window as GtagWindow).gtag;
  });

  it("uses the GA4 measurement ID fallback", () => {
    const { GA_MEASUREMENT_ID } = loadGtag();

    expect(GA_MEASUREMENT_ID).toBe("G-57NC87VXFC");
  });

  it("prefers the configured public measurement ID", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";

    const { GA_MEASUREMENT_ID } = loadGtag();

    expect(GA_MEASUREMENT_ID).toBe("G-TEST12345");
  });

  it("tracks page views in production", () => {
    const { pageview, GA_MEASUREMENT_ID } = loadGtag();

    pageview("/blog");

    expect((window as GtagWindow).gtag).toHaveBeenCalledWith(
      "config",
      GA_MEASUREMENT_ID,
      { page_path: "/blog" },
    );
  });

  it("tracks events in production", () => {
    const { event } = loadGtag();

    event("click", { section: "banner", link_text: "Resume" });

    expect((window as GtagWindow).gtag).toHaveBeenCalledWith("event", "click", {
      section: "banner",
      link_text: "Resume",
    });
  });

  it("does not throw when gtag is unavailable", () => {
    delete (window as GtagWindow).gtag;
    const { event, pageview } = loadGtag();

    expect(() => pageview("/")).not.toThrow();
    expect(() => event("click", { section: "header" })).not.toThrow();
  });

  it("no-ops outside production", () => {
    setNodeEnv("development");
    const { pageview } = loadGtag();

    pageview("/");

    expect((window as GtagWindow).gtag).not.toHaveBeenCalled();
  });

  it("provides semantic event helpers", () => {
    const { trackClick, trackSelectContent, trackSelectItem, trackSearch, trackShare } =
      loadGtag();

    trackClick({ section: "header" });
    trackSelectContent({ content_type: "blog", item_id: "post" });
    trackSelectItem({ content_type: "photo", item_id: "photo-1" });
    trackSearch({ search_term: "analytics" });
    trackShare({ method: "linkedin", content_type: "blog" });

    expect((window as GtagWindow).gtag).toHaveBeenNthCalledWith(
      1,
      "event",
      "click",
      { section: "header" },
    );
    expect((window as GtagWindow).gtag).toHaveBeenNthCalledWith(
      2,
      "event",
      "select_content",
      { content_type: "blog", item_id: "post" },
    );
    expect((window as GtagWindow).gtag).toHaveBeenNthCalledWith(
      3,
      "event",
      "select_item",
      { content_type: "photo", item_id: "photo-1" },
    );
    expect((window as GtagWindow).gtag).toHaveBeenNthCalledWith(
      4,
      "event",
      "search",
      { search_term: "analytics" },
    );
    expect((window as GtagWindow).gtag).toHaveBeenNthCalledWith(
      5,
      "event",
      "share",
      { method: "linkedin", content_type: "blog" },
    );
  });
});
