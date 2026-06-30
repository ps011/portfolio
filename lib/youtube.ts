import type { YouTubeVideo } from "../interfaces/youtube";

export const YOUTUBE_CHANNEL_ID = "UCbcnZGYObyzOZFe3elbyF9w";

const YOUTUBE_FEED_BASE_URL = "https://www.youtube.com/feeds/videos.xml";
const DEFAULT_VIDEO_LIMIT = 6;

const getText = (entry: Element, tagName: string) =>
  entry.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? "";

const getAlternateUrl = (entry: Element) => {
  const links = Array.from(entry.getElementsByTagName("link"));
  return (
    links.find((link) => link.getAttribute("rel") === "alternate") ??
    links[0]
  )?.getAttribute("href") ?? "";
};

const getThumbnailUrl = (entry: Element) =>
  entry.getElementsByTagName("media:thumbnail")[0]?.getAttribute("url") ?? "";

const decodeXmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos);/g, (match, entity) => {
    if (entity === "amp") return "&";
    if (entity === "lt") return "<";
    if (entity === "gt") return ">";
    if (entity === "quot") return "\"";
    if (entity === "apos") return "'";
    if (entity.startsWith("#x")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return match;
  });

const getXmlText = (entry: string, tagName: string) => {
  const match = entry.match(
    new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`),
  );
  return decodeXmlEntities(match?.[1]?.trim() ?? "");
};

const getXmlAttribute = (entry: string, tagName: string, attribute: string) => {
  const match = entry.match(
    new RegExp(`<${tagName}\\b[^>]*\\b${attribute}="([^"]*)"`, "i"),
  );
  return decodeXmlEntities(match?.[1] ?? "");
};

const getXmlAlternateUrl = (entry: string) => {
  const match = entry.match(
    /<link\b(?=[^>]*\brel="alternate")[^>]*\bhref="([^"]*)"/i,
  );
  return decodeXmlEntities(match?.[1] ?? "");
};

const parseYouTubeFeedWithRegex = (
  xml: string,
  limit: number,
): YouTubeVideo[] =>
  Array.from(xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g))
    .map(([, entry]) => ({
      id: getXmlText(entry, "yt:videoId"),
      title: getXmlText(entry, "title"),
      url: getXmlAlternateUrl(entry),
      thumbnailUrl: getXmlAttribute(entry, "media:thumbnail", "url"),
      publishedAt: getXmlText(entry, "published"),
    }))
    .filter((video) => video.id && video.title && video.url)
    .slice(0, limit);

export function getYouTubeFeedUrl(channelId = YOUTUBE_CHANNEL_ID) {
  const url = new URL(YOUTUBE_FEED_BASE_URL);
  url.searchParams.set("channel_id", channelId);
  return url.toString();
}

export function parseYouTubeFeed(
  xml: string,
  limit = DEFAULT_VIDEO_LIMIT,
): YouTubeVideo[] {
  if (typeof DOMParser !== "function") {
    return parseYouTubeFeedWithRegex(xml, limit);
  }

  const document = new DOMParser().parseFromString(xml, "application/xml");
  const parserError = document.getElementsByTagName("parsererror")[0];
  if (parserError) return [];

  return Array.from(document.getElementsByTagName("entry"))
    .map((entry) => ({
      id: getText(entry, "yt:videoId"),
      title: getText(entry, "title"),
      url: getAlternateUrl(entry),
      thumbnailUrl: getThumbnailUrl(entry),
      publishedAt: getText(entry, "published"),
    }))
    .filter((video) => video.id && video.title && video.url)
    .slice(0, limit);
}

export async function getYouTubeVideos(
  limit = DEFAULT_VIDEO_LIMIT,
): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(getYouTubeFeedUrl(), {
      headers: { accept: "application/atom+xml, application/xml, text/xml" },
    });

    if (!response.ok) return [];

    return parseYouTubeFeed(await response.text(), limit);
  } catch {
    return [];
  }
}
