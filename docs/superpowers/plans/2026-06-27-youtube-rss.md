# YouTube RSS Homepage Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a resilient homepage section that automatically shows recent YouTube videos from the channel RSS feed.

**Architecture:** A server-only helper builds the feed URL from the canonical channel ID, fetches RSS during `getStaticProps`, parses entries into `YouTubeVideo`, and returns `[]` on failure. A homepage section renders those videos using the existing `Section`, carousel, and `@prasheel/ui` card/button primitives.

**Tech Stack:** Next.js Pages Router, TypeScript, Jest, React Testing Library, YouTube Atom RSS, `@prasheel/ui`.

## Global Constraints

- Channel ID is `UCbcnZGYObyzOZFe3elbyF9w`.
- Do not use the YouTube Data API or a Google Cloud project.
- RSS errors must not fail static generation.
- Do not import server-only helpers into client components.
- Reuse `@prasheel/ui` primitives for card/button UI.
- Follow TDD: write failing tests before production code.

---

### Task 1: RSS Data Helper

**Files:**
- Create: `interfaces/youtube.ts`
- Create: `lib/youtube.ts`
- Test: `lib/youtube.test.ts`

**Interfaces:**
- Produces: `YouTubeVideo` with `{ id: string; title: string; url: string; thumbnailUrl: string; publishedAt: string }`
- Produces: `YOUTUBE_CHANNEL_ID = "UCbcnZGYObyzOZFe3elbyF9w"`
- Produces: `getYouTubeFeedUrl(channelId?: string): string`
- Produces: `parseYouTubeFeed(xml: string, limit?: number): YouTubeVideo[]`
- Produces: `getYouTubeVideos(limit?: number): Promise<YouTubeVideo[]>`

- [ ] **Step 1: Write failing parser and fetch tests**

Create `lib/youtube.test.ts` with tests that expect parsed video data, limited results, and empty fallback when `fetch` rejects.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/youtube.test.ts`

Expected: FAIL because `./youtube` does not exist.

- [ ] **Step 3: Add interface and minimal implementation**

Create `interfaces/youtube.ts` and `lib/youtube.ts`. Implement XML parsing with `DOMParser`, feed URL construction, fetch status validation, and `[]` fallback.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/youtube.test.ts`

Expected: PASS.

### Task 2: YouTube Section UI

**Files:**
- Create: `sections/youtube/youtube.tsx`
- Test: `sections/youtube/youtube.test.tsx`

**Interfaces:**
- Consumes: `YouTubeVideo[]`
- Produces: default React component `YouTube({ videos }: { videos: YouTubeVideo[] })`

- [ ] **Step 1: Write failing section tests**

Create `sections/youtube/youtube.test.tsx` with tests that empty videos render no section and populated videos render a `Videos` heading plus external YouTube links.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- sections/youtube/youtube.test.tsx`

Expected: FAIL because the section component does not exist.

- [ ] **Step 3: Implement section**

Create a client component that uses `Section`, `Carousel`, `CarouselContent`, `CarouselItem`, `Card`, `Button`, `Image`, and `Link`. Render nothing for empty videos.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- sections/youtube/youtube.test.tsx`

Expected: PASS.

### Task 3: Homepage Integration

**Files:**
- Modify: `pages/index.tsx`
- Test: `__tests__/pages/index.test.tsx`

**Interfaces:**
- Consumes: `getYouTubeVideos(6): Promise<YouTubeVideo[]>`
- Consumes: `YouTube` section component

- [ ] **Step 1: Update failing page tests**

Extend the homepage page tests to mock `getYouTubeVideos` and expect `getStaticProps` to expose a `youtubeVideos` prop.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/pages/index.test.tsx`

Expected: FAIL because `getYouTubeVideos` is not used by `getStaticProps`.

- [ ] **Step 3: Wire homepage data and render**

Import `getYouTubeVideos`, include it in the `Promise.all`, add `youtubeVideos` to props, and render `<YouTube videos={youtubeVideos} />` after the blog section.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- lib/youtube.test.ts sections/youtube/youtube.test.tsx __tests__/pages/index.test.tsx`

Expected: PASS.

### Task 4: Final Verification

**Files:**
- No additional files.

**Interfaces:**
- Verifies all previous tasks.

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS.
