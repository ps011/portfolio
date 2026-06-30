# YouTube RSS Homepage Section Design

## Goal

Add an automatic homepage section that shows recent videos from Prasheel Soni's YouTube channel without requiring a Google Cloud project or YouTube Data API key.

## Requirements

- Use YouTube's public Atom RSS feed.
- Store the canonical channel ID, `UCbcnZGYObyzOZFe3elbyF9w`, not the handle `@PrasheelSoni11`.
- Build the feed URL server-side as `https://www.youtube.com/feeds/videos.xml?channel_id=UCbcnZGYObyzOZFe3elbyF9w`.
- Fetch and parse the feed only from server-side homepage data loading.
- Render the section only when videos are available.
- If the feed request fails, the portfolio must still build and the section must be hidden.
- Reuse the existing homepage section style and `@prasheel/ui` primitives.

## Architecture

Add a small server-only YouTube module that fetches the RSS feed and parses entries into a portfolio-friendly `YouTubeVideo` interface. The homepage will load those videos in `getStaticProps` alongside the existing site, about, and blog data, and pass them into a new `sections/youtube/youtube.tsx` component.

The UI will follow the existing blog section pattern: a `Section` wrapper with a carousel of cards. Cards will use `@prasheel/ui` `Card` and `Button` primitives directly, so no design-system change is needed.

## Data Shape

```ts
interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  publishedAt: string;
}
```

## Error Handling

The RSS fetch helper catches network, HTTP, and parse failures and returns an empty array. This keeps static generation resilient when YouTube is unavailable.

## Testing

- Unit-test RSS parsing from a representative Atom XML sample.
- Unit-test fetch failure fallback to an empty array.
- Component-test that the section renders video links when videos exist and renders nothing for an empty array.
- Page-test that homepage data loading passes YouTube videos into the page component.
