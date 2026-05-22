export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-57NC87VXFC";

export const isProduction = process.env.NODE_ENV === "production";

const canTrack = () =>
  isProduction &&
  Boolean(GA_MEASUREMENT_ID) &&
  typeof window !== "undefined" &&
  typeof window.gtag === "function";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (!canTrack()) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = (name, params = {}) => {
  if (!canTrack()) return;
  window.gtag("event", name, params);
};

export const trackClick = (params) => event("click", params);

export const trackSelectContent = (params) =>
  event("select_content", params);

export const trackSelectItem = (params) => event("select_item", params);

export const trackSearch = (params) => event("search", params);

export const trackShare = (params) => event("share", params);
