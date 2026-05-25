# Travel Map Teaser Design

## Goal

Turn the existing homepage country map into a lightweight travel/photo teaser. The map should still communicate travel breadth, but photo-backed visited countries should now let visitors preview a curated strip of photos and continue into the full gallery already filtered to that country.

## Approved Direction

- The map remains a homepage teaser, not the full photo-gallery experience.
- The selected-country preview appears below the map on desktop and mobile.
- Only visited countries with gallery-backed photos are clickable.
- Visited countries without photos remain highlighted, but non-interactive.
- Croatia is added to visited country data as `HRV`.
- Croatia is the default selected country.
- `View all` navigates to `/photo-gallery?country=<galleryCategory>`.
- Homepage teaser photos are curated manually through featured photo IDs.

## Scope

In scope:

- Add structured travel country metadata for the homepage teaser.
- Add Croatia (`HRV`) to `data/about.json` `countriesVisited`.
- Pass gallery data to the homepage map section.
- Add selected-country state and preview strip behavior to the map section.
- Add URL query initialization to `/photo-gallery`.
- Add focused unit tests for map teaser behavior and gallery query handling.

Out of scope:

- Building a standalone travel hub.
- Adding city-level visit data, travel dates, route timelines, or story pages.
- Backfilling photos for every visited country.
- Changing the existing "Countries travelled" stat copy or count.
- Reworking the gallery masonry/lightbox experience beyond query initialization.

## Data Model

Add a small typed travel metadata source, either as a JSON data file or a typed constant near the data layer. The preferred shape is:

```ts
interface TravelCountry {
  code: string;
  name: string;
  galleryCategory: string;
  featuredPhotoIds: string[];
  defaultSelected?: boolean;
}
```

Initial records should include the current gallery-backed visited countries:

```ts
[
  {
    code: "HRV",
    name: "Croatia",
    galleryCategory: "Croatia",
    featuredPhotoIds: ["Croatia-0", "Croatia-4", "Croatia-9"],
    defaultSelected: true
  },
  {
    code: "FRA",
    name: "France",
    galleryCategory: "France",
    featuredPhotoIds: ["France-0", "France-4", "France-9"]
  },
  {
    code: "SWE",
    name: "Sweden",
    galleryCategory: "Sweden",
    featuredPhotoIds: ["Sweden-0", "Sweden-2", "Sweden-3"]
  }
]
```

The exact photo IDs can change during implementation, but they must reference real `data/gallery.json` entries. The map uses `code` for geography matching, `galleryCategory` for gallery filtering and links, and `featuredPhotoIds` for the preview strip.

## Homepage UI

The map section keeps its current heading and count badge, then renders:

1. A full-width world map.
2. A selected-country preview strip below the map.

The preview strip shows:

- Country name.
- Photo count for that country.
- Three curated featured photos when available.
- A `View all` button linking to `/photo-gallery?country=<galleryCategory>`.

On mobile, the same order is preserved. If space is tight, the photos may render as a horizontal scroll strip rather than squeezing into unreadable thumbnails.

## Map Interaction

All countries in `countriesVisited` remain visually highlighted.

Clickable countries are derived by joining:

- `countriesVisited`.
- `travelCountries`.
- `galleryItems`.

A country is clickable only when:

- Its ISO code exists in `countriesVisited`.
- It has a matching `travelCountries` entry.
- Its `galleryCategory` has at least one gallery photo.
- At least one featured photo ID resolves to a gallery item, or the category has fallback photos.

Default state:

- Select the `travelCountries` entry with `defaultSelected: true`.
- If that entry is invalid, select the first valid photo-backed country.
- If no valid photo-backed country exists, render the existing non-interactive map behavior without a preview strip.

Hover and focus behavior:

- Existing tooltip behavior remains.
- Photo-backed visited countries use a pointer cursor and stronger hover/focus affordance.
- Visited countries without gallery photos do not imply clickability.

Click behavior:

- Selecting a photo-backed country updates the preview strip.
- Non-photo countries do not update the strip.
- Analytics can use existing `trackSelectItem` or `trackSelectContent` helpers with `section: "travel_map"` when practical.

## Gallery Query Behavior

`/photo-gallery` should support `country` query initialization:

- `/photo-gallery?country=France` initializes the active filter to `France` when `France` is a valid category.
- Invalid or missing `country` falls back to `all`.
- Existing category buttons continue to work after initialization.

The filter does not need to keep the URL in sync after the user clicks category buttons in this iteration. The requirement is deep-link initialization from the homepage teaser.

## Data Flow

Homepage `getStaticProps` should load the existing site, about, and blog data, plus `galleryItems` and `travelCountries`.

At render time:

- `IndexPage` passes `countriesVisited`, `galleryItems`, and `travelCountries` into the map section.
- The map section derives photo-backed countries and selected preview data with memoized helpers.
- The preview strip links to `/photo-gallery?country=<galleryCategory>`.

Photo gallery page:

- `getStaticProps` continues to load `galleryItems`.
- The gallery component reads the router query on mount and initializes `activeFilter` only when the query country is valid.

## Error Handling And Edge Cases

- Missing featured photo IDs are skipped.
- If fewer than three featured photos resolve, show the valid subset.
- If no featured IDs resolve but the gallery category has photos, use category photos as a fallback.
- If the selected country becomes invalid, fall back to the first valid photo-backed country.
- If the gallery query country is invalid, use `all`.
- If gallery data is empty, render the existing map without clickable behavior or preview strip.
- Keep rendering safe when the GeoJSON geography source does not include a travel metadata code.

## Testing

Map tests:

- Renders the existing map heading and geography list.
- Includes Croatia as a visited country after `HRV` is added.
- Defaults the preview strip to Croatia when Croatia is valid.
- Clicking a photo-backed visited country updates the preview strip.
- Visited countries without photo metadata are highlighted but not clickable.
- Missing featured photo IDs are skipped without throwing.
- No photo-backed countries falls back to non-interactive map behavior.

Gallery tests:

- Initializes active filter from `?country=France` when valid.
- Falls back to `all` for an invalid query country.
- Category buttons still change the filter after query initialization.

Page/data tests:

- Homepage passes gallery and travel data into the map section.
- Travel country metadata references real gallery categories and photo IDs.

Verification commands after implementation:

- `npm test -- sections/map`
- `npm test -- components/instagram`
- `npm test`
- `npm run build`

## Notes

The existing data currently has more visited countries than photo-backed gallery categories. That is acceptable. This feature intentionally separates "visited" from "has curated public photos" so the homepage teaser stays honest and does not create dead-end interactions.
