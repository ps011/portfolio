import {
  getYouTubeFeedUrl,
  getYouTubeVideos,
  parseYouTubeFeed,
  YOUTUBE_CHANNEL_ID,
} from "./youtube";

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <title>Prasheel Soni</title>
  <entry>
    <id>yt:video:ndefUGEmywM</id>
    <yt:videoId>ndefUGEmywM</yt:videoId>
    <title>VIVID VILNIUS EPISODE 02: Teeth on a Wall, Castle Views, Lost Dipsi &amp; Vegan Feasts!</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=ndefUGEmywM"/>
    <published>2026-04-27T15:24:04+00:00</published>
    <media:group>
      <media:thumbnail url="https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg" width="480" height="360"/>
    </media:group>
  </entry>
  <entry>
    <id>yt:video:l82IxaZMob0</id>
    <yt:videoId>l82IxaZMob0</yt:videoId>
    <title>EPISODE 01: Cathedrals, Curries &amp; Old Town Charms</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=l82IxaZMob0"/>
    <published>2026-04-19T09:08:08+00:00</published>
    <media:group>
      <media:thumbnail url="https://i1.ytimg.com/vi/l82IxaZMob0/hqdefault.jpg" width="480" height="360"/>
    </media:group>
  </entry>
</feed>`;

describe("youtube RSS helpers", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("builds the feed URL from the canonical channel ID", () => {
    expect(YOUTUBE_CHANNEL_ID).toBe("UCbcnZGYObyzOZFe3elbyF9w");
    expect(getYouTubeFeedUrl()).toBe(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCbcnZGYObyzOZFe3elbyF9w",
    );
  });

  it("parses YouTube Atom entries into video cards", () => {
    expect(parseYouTubeFeed(feedXml)).toEqual([
      {
        id: "ndefUGEmywM",
        title:
          "VIVID VILNIUS EPISODE 02: Teeth on a Wall, Castle Views, Lost Dipsi & Vegan Feasts!",
        url: "https://www.youtube.com/watch?v=ndefUGEmywM",
        thumbnailUrl: "https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg",
        publishedAt: "2026-04-27T15:24:04+00:00",
      },
      {
        id: "l82IxaZMob0",
        title: "EPISODE 01: Cathedrals, Curries & Old Town Charms",
        url: "https://www.youtube.com/watch?v=l82IxaZMob0",
        thumbnailUrl: "https://i1.ytimg.com/vi/l82IxaZMob0/hqdefault.jpg",
        publishedAt: "2026-04-19T09:08:08+00:00",
      },
    ]);
  });

  it("parses feeds when DOMParser is unavailable in Node", () => {
    const originalDOMParser = global.DOMParser;
    Object.defineProperty(global, "DOMParser", {
      configurable: true,
      value: undefined,
    });

    try {
      expect(parseYouTubeFeed(feedXml, 1)).toEqual([
        {
          id: "ndefUGEmywM",
          title:
            "VIVID VILNIUS EPISODE 02: Teeth on a Wall, Castle Views, Lost Dipsi & Vegan Feasts!",
          url: "https://www.youtube.com/watch?v=ndefUGEmywM",
          thumbnailUrl: "https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg",
          publishedAt: "2026-04-27T15:24:04+00:00",
        },
      ]);
    } finally {
      Object.defineProperty(global, "DOMParser", {
        configurable: true,
        value: originalDOMParser,
      });
    }
  });

  it("limits parsed videos", () => {
    expect(parseYouTubeFeed(feedXml, 1)).toHaveLength(1);
  });

  it("returns an empty list when the feed request fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

    await expect(getYouTubeVideos()).resolves.toEqual([]);
  });

  it("returns an empty list when YouTube responds with an error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: jest.fn(),
    });

    await expect(getYouTubeVideos()).resolves.toEqual([]);
  });

  it("fetches and parses the RSS feed", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(feedXml),
    });

    await expect(getYouTubeVideos(1)).resolves.toEqual([
      {
        id: "ndefUGEmywM",
        title:
          "VIVID VILNIUS EPISODE 02: Teeth on a Wall, Castle Views, Lost Dipsi & Vegan Feasts!",
        url: "https://www.youtube.com/watch?v=ndefUGEmywM",
        thumbnailUrl: "https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg",
        publishedAt: "2026-04-27T15:24:04+00:00",
      },
    ]);
    expect(global.fetch).toHaveBeenCalledWith(getYouTubeFeedUrl(), {
      headers: { accept: "application/atom+xml, application/xml, text/xml" },
    });
  });
});
