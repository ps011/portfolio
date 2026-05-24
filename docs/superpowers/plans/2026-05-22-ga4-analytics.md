# GA4 Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio from legacy Universal Analytics page views to GA4 page views plus focused interaction events.

**Architecture:** Keep analytics centralized in `lib/gtag.js` with safe no-op behavior outside production or before `window.gtag` loads. Render GA scripts from `_app.tsx` through `next/script`, remove custom document GA injection, and have components call semantic helper functions for trackable interactions.

**Tech Stack:** Next.js Pages Router, React, TypeScript/JavaScript, Jest, React Testing Library, Google tag (`gtag.js`).

---

## File Structure

- Modify `lib/gtag.js`: convert the existing page-view wrapper into a GA4 helper module with production gating and semantic event helpers.
- Create `lib/gtag.test.ts`: unit tests for page views, events, no-op guards, and helper payloads.
- Modify `pages/_app.tsx`: render `next/script` GA setup and keep route-change page views.
- Modify `pages/_document.tsx`: remove GA script injection and leave theme/font document behavior intact.
- Modify `components/header/header.tsx`: track logo and nav clicks.
- Modify `components/profile/profile.tsx`: track outbound profile/social clicks.
- Modify `components/language-switcher/language-switcher.tsx`: track locale selection.
- Modify `components/blog-card.tsx`: track blog read clicks.
- Modify `sections/banner/banner.tsx`: track banner CTA clicks.
- Modify `sections/blog-index/blog-index.tsx`: track search and tag filters.
- Modify `sections/blog/blog.tsx`: track carousel controls.
- Modify `pages/blog/[link].tsx`: track author and share clicks.
- Modify `components/instagram/gallery.tsx`: track gallery filters and lightbox actions.

## Task 1: Analytics Helper Tests

**Files:**
- Create: `lib/gtag.test.ts`
- Modify: `lib/gtag.js`

- [ ] **Step 1: Write failing tests for the GA wrapper**

Create `lib/gtag.test.ts` with tests equivalent to:

```ts
const originalNodeEnv = process.env.NODE_ENV;

const loadGtag = () => {
  jest.resetModules();
  return require("./gtag");
};

describe("gtag analytics helpers", () => {
  beforeEach(() => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "production",
      configurable: true,
    });
    (window as any).gtag = jest.fn();
  });

  afterEach(() => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: originalNodeEnv,
      configurable: true,
    });
    delete (window as any).gtag;
  });

  it("uses the GA4 measurement ID", () => {
    const { GA_MEASUREMENT_ID } = loadGtag();
    expect(GA_MEASUREMENT_ID).toBe("G-57NC87VXFC");
  });

  it("tracks page views in production", () => {
    const { pageview, GA_MEASUREMENT_ID } = loadGtag();
    pageview("/blog");
    expect(window.gtag).toHaveBeenCalledWith("config", GA_MEASUREMENT_ID, {
      page_path: "/blog",
    });
  });

  it("tracks events in production", () => {
    const { event } = loadGtag();
    event("click", { section: "banner", link_text: "Resume" });
    expect(window.gtag).toHaveBeenCalledWith("event", "click", {
      section: "banner",
      link_text: "Resume",
    });
  });

  it("does not throw when gtag is unavailable", () => {
    delete (window as any).gtag;
    const { event, pageview } = loadGtag();
    expect(() => pageview("/")).not.toThrow();
    expect(() => event("click", { section: "header" })).not.toThrow();
  });

  it("no-ops outside production", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "development",
      configurable: true,
    });
    const { pageview } = loadGtag();
    pageview("/");
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- lib/gtag.test.ts`

Expected: FAIL because `GA_MEASUREMENT_ID` and `event` are not implemented.

## Task 2: GA4 Runtime Wiring

**Files:**
- Modify: `lib/gtag.js`
- Modify: `pages/_app.tsx`
- Modify: `pages/_document.tsx`
- Test: `lib/gtag.test.ts`

- [ ] **Step 1: Implement the helper module**

Update `lib/gtag.js` to expose:

```js
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-57NC87VXFC";

export const isProduction = process.env.NODE_ENV === "production";

const canTrack = () =>
  isProduction &&
  Boolean(GA_MEASUREMENT_ID) &&
  typeof window !== "undefined" &&
  typeof window.gtag === "function";

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
```

- [ ] **Step 2: Render GA scripts in `_app.tsx`**

Use `next/script`, render scripts only in production with a configured measurement ID, and keep route-change page views. The scripts should load `https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}` and initialize `window.dataLayer`, `gtag("js", new Date())`, and `gtag("config", measurementId, { page_path: window.location.pathname })`.

- [ ] **Step 3: Remove GA scripts from `_document.tsx`**

Delete the `GA_TRACKING_ID` import, `isProduction` constant, and GA script block. Keep theme preset script, font links, body, `Main`, and `NextScript` unchanged.

- [ ] **Step 4: Run the focused helper test**

Run: `npm test -- lib/gtag.test.ts`

Expected: PASS.

## Task 3: Interaction Event Instrumentation

**Files:**
- Modify: `lib/gtag.js`
- Modify: `components/header/header.tsx`
- Modify: `components/profile/profile.tsx`
- Modify: `components/language-switcher/language-switcher.tsx`
- Modify: `components/blog-card.tsx`
- Modify: `sections/banner/banner.tsx`
- Modify: `sections/blog-index/blog-index.tsx`
- Modify: `sections/blog/blog.tsx`
- Modify: `pages/blog/[link].tsx`
- Modify: `components/instagram/gallery.tsx`

- [ ] **Step 1: Add semantic helper functions**

Add helpers to `lib/gtag.js` that wrap `event`, including:

```js
export const trackClick = (params) => event("click", params);
export const trackSelectContent = (params) => event("select_content", params);
export const trackSelectItem = (params) => event("select_item", params);
export const trackSearch = (params) => event("search", params);
export const trackShare = (params) => event("share", params);
```

- [ ] **Step 2: Track CTA, nav, profile, and language clicks**

Add `onClick` handlers that call the relevant helper with stable parameters:

```ts
gtag.trackClick({
  section: "banner",
  content_type: "cta",
  link_url: ctaUrl,
  link_text: translatedCtaLabel,
});
```

Use analogous payloads for header nav/logo, profile links, and language links.

- [ ] **Step 3: Track blog interactions**

Add helper calls for blog reads, search input changes, tag filters, carousel controls, author profile clicks, and share links. Use `content_type: "blog"` for reads and shares, `section: "blog_index"` for search/filter events, and include `item_id` or `item_name` where available.

- [ ] **Step 4: Track gallery interactions**

Add helper calls for category filters, lightbox open/close, previous/next, and thumbnail selection. Include `content_type: "photo"`, `section: "photo_gallery"`, and `item_id`/`item_name` from the selected image.

- [ ] **Step 5: Run impacted tests**

Run:

```bash
npm test -- lib/gtag.test.ts components/header sections/blog sections/blog-index __tests__/components/language-switcher.test.tsx
```

Expected: PASS.

## Task 4: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS with no lint errors.

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Review git diff**

Run: `git diff --stat && git diff -- lib/gtag.js pages/_app.tsx pages/_document.tsx`

Expected: Diff is limited to analytics helper, GA runtime wiring, event instrumentation, tests, and docs.
