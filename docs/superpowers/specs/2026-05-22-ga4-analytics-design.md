# GA4 Analytics Design

## Context

The app currently loads Google Analytics in production through `pages/_document.tsx` and sends client-side route-change page views from `pages/_app.tsx`. The configured ID is the legacy Universal Analytics ID `UA-151206536-1`, which should be replaced with the GA4 Measurement ID `G-57NC87VXFC`.

The current implementation only captures page views. The goal is to keep GA integration simple while adding useful event coverage for portfolio behavior.

## Goals

- Use GA4 through the provided Measurement ID.
- Keep analytics disabled outside production.
- Preserve page-view tracking for initial loads and client-side route changes.
- Add structured events for high-intent interactions.
- Keep event helpers centralized so component code does not call `window.gtag` directly.

## Non-Goals

- No Google Tag Manager migration.
- No server-side Measurement Protocol.
- No cookie consent UI.
- No scroll-depth, read-depth, or timing events in this iteration.

## Architecture

Analytics remains a lightweight client-side integration:

- `lib/gtag` owns the Measurement ID, GA readiness checks, page-view tracking, and event helper functions.
- `_document` no longer injects GA script tags. GA scripts should load through Next's runtime script mechanism so they are not embedded in the custom document lifecycle.
- `_app` renders the GA script component, sends route-change page views, and keeps production gating centralized.
- Components import semantic helper functions from `lib/gtag` instead of building GA payloads inline.

The Measurement ID should come from `NEXT_PUBLIC_GA_MEASUREMENT_ID`, with `G-57NC87VXFC` as the current fallback so production works even before hosting env vars are updated.

## Event Contract

Use GA4-style event names with lower-case snake case:

- `select_content` for opening or reading site content.
- `search` for blog search.
- `share` for blog share actions.
- `select_item` for category, tag, carousel, and gallery selections.
- `click` for outbound links, nav links, and CTAs.

Shared parameters:

- `section`: UI area, such as `header`, `banner`, `footer`, `blog_index`, or `photo_gallery`.
- `link_url`: destination URL when applicable.
- `link_text`: visible label or stable action name.
- `content_type`: type such as `blog`, `profile`, `photo`, `nav`, `cta`, or `language`.
- `item_id`: stable identifier for blog links, photo IDs, tags, categories, or locale codes.
- `item_name`: human-readable title, label, category, or provider name.

Initial event coverage:

- Banner CTA/resume clicks.
- Profile/social outbound clicks.
- Header navigation and logo clicks.
- Language switches.
- Blog card read clicks.
- Blog search query changes.
- Blog tag filters.
- Blog share clicks.
- Blog carousel previous, next, and dot selection.
- Gallery category filters.
- Gallery lightbox open, close, previous, next, and thumbnail selection.

## Error Handling

Analytics helpers must safely no-op when:

- `NODE_ENV` is not `production`.
- `window` is unavailable.
- `window.gtag` has not loaded.
- The Measurement ID is missing.

This prevents tests, server rendering, and development browsing from throwing or sending accidental data.

## Testing

Add focused tests for `lib/gtag`:

- Page views call `gtag("config", measurementId, ...)` in production.
- Events call `gtag("event", eventName, params)` in production.
- Missing `window.gtag` does not throw.
- Non-production environments no-op.

Existing component tests should continue to pass. Run the full Jest suite after implementation.
