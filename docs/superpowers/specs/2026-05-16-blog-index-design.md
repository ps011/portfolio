# Blog Index Page — Design

## Goal

Add a `/blog` index page that lists all published blog posts with a search box and a tag filter. Mirrors the role `/photo-gallery` plays for photos. Individual post route `/blog/[link]` is unchanged.

## Scope

- **In:** entries in `data/blogs.json` where `type === "blogs"` and `hidden !== true`.
- **Out:** `type === "coding-challenge"` and `type === "hobby-projects"` — those remain on the homepage carousels only.

## Route & files

- `pages/blog/index.tsx` — new page; runs `getStaticProps`, renders the section component. Coexists with `pages/blog/[link].tsx` (Pages Router resolves `index` before the dynamic segment).
- `sections/blog-index/blog-index.tsx` — new client component holding filter state.
- `sections/blog-index/blog-index.test.tsx` — co-located Jest + RTL tests.
- `components/header/header.tsx` — add a "Blog" link to the nav.
- `messages/en.json`, `messages/hi.json` — new `blogIndex` namespace.

No new dependencies. Reuses existing `BlogCard`, `Input`, `Button`, and `lib/data.ts` helpers.

## Data flow

**Build time** — `getStaticProps` calls `getBlogs()`, filters to `type === "blogs" && !hidden`, sorts by `date` descending, passes as `blogs` prop. Hidden / non-blog entries never reach the client.

**Client state** (in `BlogIndex`):
- `query: string` — controlled search input.
- `activeTag: string` — defaults to `"all"`.
- `deferredQuery = useDeferredValue(query)` — keeps typing snappy without adding a debounce dependency.

**Derived (memoized):**
- `tags` — union of trimmed, non-empty tag tokens across all blogs, sorted alphabetically.
- `filtered` — applies tag filter (`activeTag === "all" || tags.includes(activeTag)`) AND search filter (case-insensitive substring match against `title` and `shortDescription`).

Tag normalization handles both `string` and `string[]` shapes since `BlogCardData.tags` permits both.

## UI

Page-level container matches the photo-gallery look: `container mx-auto px-6 py-12` with the same outer background. Reuses existing primitives for visual cohesion.

Layout, top to bottom:
1. **Header** — `h1` title and `p` subtitle, centered, both i18n-driven.
2. **Search input** — `<Input>` with a `lucide-react` Search icon, max-width ~`max-w-xl`, centered.
3. **Tag chips** — `<Button variant={active ? "default" : "neutral"} size="sm">` row, wraps on small screens. "All" is the sentinel that clears the tag filter. **The entire chip row is omitted from the DOM when no tags exist** (e.g., if the JSON has only empty `tags` strings).
4. **Grid** — `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` of existing `BlogCard` instances. 3-col cap at `lg` keeps card text legible compared to the gallery's 4-col density.
5. **Empty state** — when `filtered.length === 0`, a single muted `<p>` rendered with the `blogIndex.noResults` i18n key; search and tag controls remain interactive.

## i18n

New namespace `blogIndex` in both locales:

```json
"blogIndex": {
  "title": "Blog",
  "subtitle": "Thoughts on travel, tech, and the in-between.",
  "searchPlaceholder": "Search blogs…",
  "allTag": "All",
  "noResults": "No blogs match your search."
}
```

Hindi translations added in the same commit. `<Head><title>` stays English (`"Blog | Prasheel Soni"`) to match the existing photo-gallery / dev pages.

## Edge cases

- **Empty tag list:** chip row omitted entirely; no "All" pill.
- **No filter matches:** empty-state message; controls remain functional.
- **Blog without thumbnail:** handled by existing `BlogCard`.
- **Hidden / non-blog entries:** stripped server-side in `getStaticProps`; cannot be surfaced by client state.
- **Locale switch while filtering:** page remounts via Next routing; filter state resets. Acceptable and consistent with the gallery page.

## Testing

Co-located `blog-index.test.tsx` using existing `__mocks__/next-intl.tsx`. No new mock surface needed.

Cases:
1. Renders all (visible, type=blogs) entries by default.
2. Search filters by title (case-insensitive).
3. Search filters by `shortDescription`.
4. Tag chip filters to entries containing that tag; "All" restores full list.
5. Search and tag combine with AND.
6. Renders `noResults` message when filters yield zero matches.
7. Tag row is absent from the DOM when no tags exist.
8. `getStaticProps` filter excludes `hidden: true` and `type !== "blogs"` (unit test on the filter function, or via a page-level test).

Verification per CLAUDE.md:
- `npm test -- sections/blog-index` during development.
- `npm test` and `npm run build` before marking complete.
- Manual browser check after dev server start to confirm grid, search, and tag chip interactions.

## Known caveat — tag data is thin

Most current entries in `data/blogs.json` have `tags: ""`. The filter works correctly today (only the two tagged entries appear under their respective tags) but the chip row will look sparse. Backfilling tags is **out of scope** for this work and is tracked as a follow-up.

## Out of scope (explicit)

- URL-synced filter state (`?q=…&tag=…`). Filter state is purely client-side; can be added later if shareable filter links become valuable.
- Pagination. At ~10 entries today and modest growth expected, a flat grid is fine.
- Tag backfill across the JSON.
- Replacing the homepage blog carousels.
