# Travel Map Teaser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a homepage travel map teaser that lets visitors click photo-backed visited countries, preview curated photos below the map, and continue into `/photo-gallery` filtered to that country.

**Architecture:** Add a small typed travel metadata source that joins ISO country codes to gallery categories and curated featured photo IDs. Keep derivation logic in a focused helper so the map component stays mostly presentational, and add URL-query initialization to the existing gallery component without changing its masonry/lightbox behavior.

**Tech Stack:** Next.js Pages Router, React, TypeScript, Jest, React Testing Library, `react-simple-maps`, `@prasheel/ui`, existing JSON data loaders.

---

## File Structure

- Create `interfaces/travel.ts` for the `TravelCountry` interface.
- Create `data/travel-countries.json` for curated country metadata.
- Create `sections/map/travel-map-utils.ts` for joining travel metadata, visited countries, and gallery items.
- Create `sections/map/travel-map-utils.test.ts` for utility behavior.
- Create `components/instagram/gallery.test.tsx` for query-initialized gallery filtering.
- Modify `lib/data.ts` to load travel metadata.
- Modify `__tests__/lib/data.test.ts` to validate travel metadata against gallery data.
- Modify `data/about.json` to add Croatia as `HRV`.
- Modify `pages/index.tsx` to load and pass `galleryItems` plus `travelCountries` into the map.
- Modify `__tests__/pages/index.test.tsx` to assert map props.
- Modify `sections/map/map.tsx` to render clickable countries and the below-map preview strip.
- Modify `sections/map/map.test.tsx` to cover teaser behavior.
- Modify `components/instagram/gallery.tsx` to initialize the active filter from `router.query.country`.

Known local issue before committing code: the current pre-commit hook runs `eslint --fix .`, and generated `.worktrees/**/.next/**` files can make that hook fail. Clean those generated directories or add an isolated tooling ignore fix before relying on normal commit hooks.

---

### Task 1: Travel Metadata Loader

**Files:**
- Create: `interfaces/travel.ts`
- Create: `data/travel-countries.json`
- Modify: `lib/data.ts`
- Modify: `__tests__/lib/data.test.ts`

- [ ] **Step 1: Write failing data-loader tests**

Add `getTravelCountries` to the import list in `__tests__/lib/data.test.ts`:

```ts
import {
  getSiteData,
  getAboutData,
  getBlogs,
  getBlogByLink,
  getGalleryItems,
  getTravelCountries,
} from "../../lib/data";
```

Add this `describe` block before the final closing brace:

```ts
describe("getTravelCountries", () => {
  it("returns curated travel country metadata", async () => {
    const countries = await getTravelCountries();

    expect(countries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "HRV",
          name: "Croatia",
          galleryCategory: "Croatia",
          defaultSelected: true,
        }),
      ]),
    );
    expect(countries.every((country) => country.featuredPhotoIds.length > 0)).toBe(true);
  });

  it("references existing gallery categories and photo IDs", async () => {
    const [countries, galleryItems] = await Promise.all([
      getTravelCountries(),
      getGalleryItems(),
    ]);
    const galleryCategories = new Set(galleryItems.map((item) => item.category));
    const galleryIds = new Set(galleryItems.map((item) => item.id));

    for (const country of countries) {
      expect(galleryCategories.has(country.galleryCategory)).toBe(true);
      for (const photoId of country.featuredPhotoIds) {
        expect(galleryIds.has(photoId)).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
npm test -- __tests__/lib/data.test.ts --runInBand
```

Expected: the suite fails because `getTravelCountries` is not exported from `lib/data.ts`.

- [ ] **Step 3: Add the travel country type**

Create `interfaces/travel.ts`:

```ts
export interface TravelCountry {
  code: string;
  name: string;
  galleryCategory: string;
  featuredPhotoIds: string[];
  defaultSelected?: boolean;
}
```

- [ ] **Step 4: Add curated travel metadata**

Create `data/travel-countries.json`:

```json
[
  {
    "code": "HRV",
    "name": "Croatia",
    "galleryCategory": "Croatia",
    "featuredPhotoIds": ["Croatia-0", "Croatia-4", "Croatia-9"],
    "defaultSelected": true
  },
  {
    "code": "FRA",
    "name": "France",
    "galleryCategory": "France",
    "featuredPhotoIds": ["France-0", "France-4", "France-9"]
  },
  {
    "code": "SWE",
    "name": "Sweden",
    "galleryCategory": "Sweden",
    "featuredPhotoIds": ["Sweden-0", "Sweden-2", "Sweden-3"]
  }
]
```

- [ ] **Step 5: Export the data loader**

In `lib/data.ts`, add the import:

```ts
import type { TravelCountry } from "../interfaces/travel";
```

Add this function after `getGalleryItems`:

```ts
export async function getTravelCountries(): Promise<TravelCountry[]> {
  return readJsonFile<TravelCountry[]>("travel-countries.json");
}
```

- [ ] **Step 6: Run the tests and verify they pass**

Run:

```bash
npm test -- __tests__/lib/data.test.ts --runInBand
```

Expected: the data tests pass.

- [ ] **Step 7: Commit**

```bash
git add interfaces/travel.ts data/travel-countries.json lib/data.ts __tests__/lib/data.test.ts
git commit -m "feat: add travel country metadata"
```

---

### Task 2: Homepage Data Plumbing

**Files:**
- Modify: `data/about.json`
- Modify: `pages/index.tsx`
- Modify: `__tests__/pages/index.test.tsx`

- [ ] **Step 1: Write the failing page prop test**

In `__tests__/pages/index.test.tsx`, replace the map mock with a prop-capturing mock:

```ts
const mockMap = jest.fn(() => <section data-testid="map" />);

jest.mock("../../sections/map/map", () => ({
  Map: (props: Record<string, unknown>) => mockMap(props),
}));
```

Add these fixtures after `mockBlogs`:

```ts
const mockGalleryItems = [
  {
    id: "Croatia-0",
    src: "/croatia.jpg",
    thumb: "/croatia-thumb.jpg",
    caption: "Croatia coast",
    category: "Croatia",
    location: "Croatia",
  },
];

const mockTravelCountries = [
  {
    code: "HRV",
    name: "Croatia",
    galleryCategory: "Croatia",
    featuredPhotoIds: ["Croatia-0"],
    defaultSelected: true,
  },
];
```

Add this reset inside `describe("IndexPage", () => {`:

```ts
beforeEach(() => {
  mockMap.mockClear();
});
```

Update existing `IndexPage` render calls to pass the new props:

```tsx
<IndexPage
  bannerData={mockBannerData}
  aboutData={mockAboutData}
  blogs={mockBlogs}
  galleryItems={mockGalleryItems}
  travelCountries={mockTravelCountries}
/>
```

Add this test:

```ts
it("passes gallery and travel data into the map", () => {
  render(
    <IndexPage
      bannerData={mockBannerData}
      aboutData={mockAboutData}
      blogs={mockBlogs}
      galleryItems={mockGalleryItems}
      travelCountries={mockTravelCountries}
    />,
  );

  expect(mockMap).toHaveBeenCalledWith(
    expect.objectContaining({
      countriesVisited: mockAboutData.countriesVisited,
      galleryItems: mockGalleryItems,
      travelCountries: mockTravelCountries,
    }),
  );
});
```

- [ ] **Step 2: Run the page test and verify it fails**

Run:

```bash
npm test -- __tests__/pages/index.test.tsx --runInBand
```

Expected: the new prop assertion fails because `IndexPage` does not pass `galleryItems` and `travelCountries` into `Map`.

- [ ] **Step 3: Add Croatia to visited countries**

In `data/about.json`, add `"HRV"` to the `countriesVisited` array after `"TUR"`:

```json
    "DNK",
    "TUR",
    "HRV"
```

- [ ] **Step 4: Load and pass homepage travel data**

In `pages/index.tsx`, update the data import:

```ts
import {
  getSiteData,
  getAboutData,
  getBlogs,
  getGalleryItems,
  getTravelCountries,
} from "../lib/data";
import type { GalleryImage } from "../interfaces/photo-gallery";
import type { TravelCountry } from "../interfaces/travel";
```

Update `getStaticProps`:

```ts
const [siteData, aboutData, blogs, galleryItems, travelCountries] = await Promise.all([
  getSiteData(),
  getAboutData(),
  getBlogs(),
  getGalleryItems(),
  getTravelCountries(),
]);
```

Add the new props to the returned object:

```ts
props: {
  siteData,
  aboutData,
  bannerData: siteData.banner,
  blogs,
  galleryItems,
  travelCountries,
  messages: (await import(`../messages/${context.locale}.json`)).default,
},
```

Update `IndexPageProps`:

```ts
interface IndexPageProps {
  bannerData: any;
  aboutData: any;
  blogs: BlogCard[];
  galleryItems: GalleryImage[];
  travelCountries: TravelCountry[];
}
```

Update the component signature and map render:

```tsx
export default function IndexPage({
  bannerData,
  aboutData,
  blogs,
  galleryItems,
  travelCountries,
}: IndexPageProps) {
  const countriesVisited = aboutData?.countriesVisited;

  return (
    <>
      {bannerData && <Banner {...bannerData} />}
      <div>
        {aboutData && <About {...aboutData} />}
        {aboutData?.experience?.length > 0 && (
          <Experience experience={aboutData.experience} />
        )}
        {blogs && <BlogSection blogs={blogs} />}
        {countriesVisited && (
          <Map
            countriesVisited={countriesVisited}
            galleryItems={galleryItems}
            travelCountries={travelCountries}
          />
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- __tests__/pages/index.test.tsx __tests__/lib/data.test.ts --runInBand
```

Expected: both suites pass.

- [ ] **Step 6: Commit**

```bash
git add data/about.json pages/index.tsx __tests__/pages/index.test.tsx
git commit -m "feat: pass travel teaser data to homepage map"
```

---

### Task 3: Travel Map Derivation Helpers

**Files:**
- Create: `sections/map/travel-map-utils.ts`
- Create: `sections/map/travel-map-utils.test.ts`

- [ ] **Step 1: Write failing utility tests**

Create `sections/map/travel-map-utils.test.ts`:

```ts
import {
  buildTravelCountryPreviews,
  getInitialSelectedCode,
  findPreviewByCode,
} from "./travel-map-utils";
import type { GalleryImage } from "../../interfaces/photo-gallery";
import type { TravelCountry } from "../../interfaces/travel";

const galleryItems: GalleryImage[] = [
  {
    id: "Croatia-0",
    src: "/croatia-0.jpg",
    thumb: "/croatia-0-thumb.jpg",
    caption: "Croatia coast",
    category: "Croatia",
    location: "Croatia",
  },
  {
    id: "Croatia-4",
    src: "/croatia-4.jpg",
    thumb: "/croatia-4-thumb.jpg",
    caption: "Old town",
    category: "Croatia",
    location: "Croatia",
  },
  {
    id: "France-0",
    src: "/france-0.jpg",
    thumb: "/france-0-thumb.jpg",
    caption: "Paris",
    category: "France",
    location: "Paris",
  },
];

const travelCountries: TravelCountry[] = [
  {
    code: "HRV",
    name: "Croatia",
    galleryCategory: "Croatia",
    featuredPhotoIds: ["Croatia-0", "missing-photo", "Croatia-4"],
    defaultSelected: true,
  },
  {
    code: "FRA",
    name: "France",
    galleryCategory: "France",
    featuredPhotoIds: ["missing-france-photo"],
  },
  {
    code: "IND",
    name: "India",
    galleryCategory: "India",
    featuredPhotoIds: ["India-0"],
  },
];

describe("travel map utils", () => {
  it("builds previews only for visited countries with gallery photos", () => {
    const previews = buildTravelCountryPreviews({
      countriesVisited: ["HRV", "FRA", "IND"],
      galleryItems,
      travelCountries,
    });

    expect(previews.map((preview) => preview.code)).toEqual(["HRV", "FRA"]);
    expect(previews[0]).toMatchObject({
      code: "HRV",
      name: "Croatia",
      galleryCategory: "Croatia",
      photoCount: 2,
      defaultSelected: true,
    });
  });

  it("skips missing featured photo IDs and uses category fallback when needed", () => {
    const previews = buildTravelCountryPreviews({
      countriesVisited: ["HRV", "FRA"],
      galleryItems,
      travelCountries,
    });

    expect(findPreviewByCode(previews, "HRV")?.featuredPhotos.map((photo) => photo.id)).toEqual([
      "Croatia-0",
      "Croatia-4",
    ]);
    expect(findPreviewByCode(previews, "FRA")?.featuredPhotos.map((photo) => photo.id)).toEqual([
      "France-0",
    ]);
  });

  it("selects the default valid country before falling back to the first preview", () => {
    const previews = buildTravelCountryPreviews({
      countriesVisited: ["HRV", "FRA"],
      galleryItems,
      travelCountries,
    });
    expect(getInitialSelectedCode(previews)).toBe("HRV");

    const noDefault = previews.map((preview) => ({
      ...preview,
      defaultSelected: false,
    }));
    expect(getInitialSelectedCode(noDefault)).toBe("HRV");
  });

  it("returns null when there are no valid previews", () => {
    const previews = buildTravelCountryPreviews({
      countriesVisited: ["IND"],
      galleryItems,
      travelCountries,
    });

    expect(previews).toEqual([]);
    expect(getInitialSelectedCode(previews)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the utility tests and verify they fail**

Run:

```bash
npm test -- sections/map/travel-map-utils.test.ts --runInBand
```

Expected: the suite fails because `sections/map/travel-map-utils.ts` does not exist.

- [ ] **Step 3: Implement derivation helpers**

Create `sections/map/travel-map-utils.ts`:

```ts
import type { GalleryImage } from "../../interfaces/photo-gallery";
import type { TravelCountry } from "../../interfaces/travel";

export interface TravelCountryPreview {
  code: string;
  name: string;
  galleryCategory: string;
  photoCount: number;
  featuredPhotos: GalleryImage[];
  defaultSelected: boolean;
}

interface BuildTravelCountryPreviewsArgs {
  countriesVisited: string[];
  galleryItems: GalleryImage[];
  travelCountries: TravelCountry[];
}

export function buildTravelCountryPreviews({
  countriesVisited,
  galleryItems,
  travelCountries,
}: BuildTravelCountryPreviewsArgs): TravelCountryPreview[] {
  const visitedCodes = new Set(countriesVisited);
  const photosByCategory = new Map<string, GalleryImage[]>();

  for (const item of galleryItems) {
    const existing = photosByCategory.get(item.category) ?? [];
    photosByCategory.set(item.category, [...existing, item]);
  }

  return travelCountries.reduce<TravelCountryPreview[]>((previews, country) => {
    if (!visitedCodes.has(country.code)) return previews;

    const categoryPhotos = photosByCategory.get(country.galleryCategory) ?? [];
    if (categoryPhotos.length === 0) return previews;

    const categoryPhotosById = new Map(categoryPhotos.map((photo) => [photo.id, photo]));
    const featuredPhotos = country.featuredPhotoIds
      .map((photoId) => categoryPhotosById.get(photoId))
      .filter((photo): photo is GalleryImage => Boolean(photo));
    const previewPhotos = featuredPhotos.length > 0
      ? featuredPhotos.slice(0, 3)
      : categoryPhotos.slice(0, 3);

    previews.push({
      code: country.code,
      name: country.name,
      galleryCategory: country.galleryCategory,
      photoCount: categoryPhotos.length,
      featuredPhotos: previewPhotos,
      defaultSelected: Boolean(country.defaultSelected),
    });

    return previews;
  }, []);
}

export function getInitialSelectedCode(previews: TravelCountryPreview[]): string | null {
  return previews.find((preview) => preview.defaultSelected)?.code ?? previews[0]?.code ?? null;
}

export function findPreviewByCode(
  previews: TravelCountryPreview[],
  code: string | null,
): TravelCountryPreview | null {
  if (!code) return null;
  return previews.find((preview) => preview.code === code) ?? null;
}
```

- [ ] **Step 4: Run the utility tests and verify they pass**

Run:

```bash
npm test -- sections/map/travel-map-utils.test.ts --runInBand
```

Expected: the utility tests pass.

- [ ] **Step 5: Commit**

```bash
git add sections/map/travel-map-utils.ts sections/map/travel-map-utils.test.ts
git commit -m "feat: derive travel map previews"
```

---

### Task 4: Map Teaser UI

**Files:**
- Modify: `sections/map/map.tsx`
- Modify: `sections/map/map.test.tsx`

- [ ] **Step 1: Write failing map teaser tests**

In `sections/map/map.test.tsx`, update imports:

```ts
import { fireEvent, render, screen } from "@testing-library/react";
import { Map } from "./map";
import type { GalleryImage } from "../../interfaces/photo-gallery";
import type { TravelCountry } from "../../interfaces/travel";
```

Replace the `react-simple-maps` mock with:

```ts
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("react-simple-maps", () => ({
  ComposableMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="composable-map">{children}</div>
  ),
  Geographies: ({
    children,
  }: {
    geography: string;
    children: (props: {
      geographies: { rsmKey: string; id: string; properties: { name: string } }[];
    }) => React.ReactNode;
  }) => {
    const mockGeographies = [
      { rsmKey: "hrv", id: "HRV", properties: { name: "Croatia" } },
      { rsmKey: "fra", id: "FRA", properties: { name: "France" } },
      { rsmKey: "ind", id: "IND", properties: { name: "India" } },
    ];
    return <div data-testid="geographies">{children({ geographies: mockGeographies })}</div>;
  },
  Geography: ({
    geography,
    onClick,
    style,
  }: {
    geography: { id: string; properties: { name: string } };
    onClick?: () => void;
    style?: { hover?: { cursor?: string } };
  }) => (
    <button
      type="button"
      data-testid={`geo-${geography.id}`}
      data-cursor={style?.hover?.cursor}
      onClick={onClick}
    >
      {geography.properties.name}
    </button>
  ),
}));
```

Add these fixtures:

```ts
const galleryItems: GalleryImage[] = [
  {
    id: "Croatia-0",
    src: "/croatia-0.jpg",
    thumb: "/croatia-0-thumb.jpg",
    caption: "Croatia coast",
    category: "Croatia",
    location: "Croatia",
  },
  {
    id: "Croatia-4",
    src: "/croatia-4.jpg",
    thumb: "/croatia-4-thumb.jpg",
    caption: "Old town",
    category: "Croatia",
    location: "Croatia",
  },
  {
    id: "France-0",
    src: "/france-0.jpg",
    thumb: "/france-0-thumb.jpg",
    caption: "Paris streets",
    category: "France",
    location: "Paris",
  },
];

const travelCountries: TravelCountry[] = [
  {
    code: "HRV",
    name: "Croatia",
    galleryCategory: "Croatia",
    featuredPhotoIds: ["Croatia-0", "Croatia-4"],
    defaultSelected: true,
  },
  {
    code: "FRA",
    name: "France",
    galleryCategory: "France",
    featuredPhotoIds: ["France-0"],
  },
];
```

Add these tests:

```ts
it("defaults the preview strip to Croatia when it is valid", () => {
  render(
    <Map
      countriesVisited={["HRV", "FRA", "IND"]}
      galleryItems={galleryItems}
      travelCountries={travelCountries}
    />,
  );

  expect(screen.getByRole("heading", { name: "Croatia" })).toBeInTheDocument();
  expect(screen.getByText("2 photos")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view all croatia photos/i })).toHaveAttribute(
    "href",
    "/photo-gallery?country=Croatia",
  );
});

it("updates the preview strip when a photo-backed country is clicked", () => {
  render(
    <Map
      countriesVisited={["HRV", "FRA", "IND"]}
      galleryItems={galleryItems}
      travelCountries={travelCountries}
    />,
  );

  fireEvent.click(screen.getByTestId("geo-FRA"));

  expect(screen.getByRole("heading", { name: "France" })).toBeInTheDocument();
  expect(screen.getByText("1 photo")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view all france photos/i })).toHaveAttribute(
    "href",
    "/photo-gallery?country=France",
  );
});

it("keeps visited countries without photos non-clickable", () => {
  render(
    <Map
      countriesVisited={["HRV", "IND"]}
      galleryItems={galleryItems}
      travelCountries={travelCountries}
    />,
  );

  expect(screen.getByTestId("geo-HRV")).toHaveAttribute("data-cursor", "pointer");
  expect(screen.getByTestId("geo-IND")).toHaveAttribute("data-cursor", "default");

  fireEvent.click(screen.getByTestId("geo-IND"));
  expect(screen.getByRole("heading", { name: "Croatia" })).toBeInTheDocument();
});

it("omits the preview strip when there are no photo-backed countries", () => {
  render(
    <Map
      countriesVisited={["IND"]}
      galleryItems={galleryItems}
      travelCountries={travelCountries}
    />,
  );

  expect(screen.queryByRole("link", { name: /view all/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the map tests and verify they fail**

Run:

```bash
npm test -- sections/map --runInBand
```

Expected: the new tests fail because the map component does not accept gallery or travel props and does not render the preview strip.

- [ ] **Step 3: Implement map props, selection state, and preview strip**

In `sections/map/map.tsx`, add imports:

```ts
import Image from "next/image";
import Link from "next/link";
import type { GalleryImage } from "../../interfaces/photo-gallery";
import type { TravelCountry } from "../../interfaces/travel";
import {
  buildTravelCountryPreviews,
  findPreviewByCode,
  getInitialSelectedCode,
} from "./travel-map-utils";
import { trackSelectItem } from "@/lib/gtag";
```

Update the existing UI import from `@prasheel/ui` so it includes both components:

```ts
import { Badge, Button } from "@prasheel/ui";
```

Replace the component props with:

```ts
interface MapProps {
  countriesVisited: string[];
  galleryItems?: GalleryImage[];
  travelCountries?: TravelCountry[];
}

const Map = ({
  countriesVisited,
  galleryItems = [],
  travelCountries = [],
}: MapProps) => {
```

Add derived preview state near the tooltip state:

```ts
const previews = React.useMemo(
  () =>
    buildTravelCountryPreviews({
      countriesVisited,
      galleryItems,
      travelCountries,
    }),
  [countriesVisited, galleryItems, travelCountries],
);

const initialSelectedCode = React.useMemo(
  () => getInitialSelectedCode(previews),
  [previews],
);
const [selectedCode, setSelectedCode] = useState<string | null>(initialSelectedCode);

useEffect(() => {
  setSelectedCode((currentCode) =>
    findPreviewByCode(previews, currentCode) ? currentCode : initialSelectedCode,
  );
}, [initialSelectedCode, previews]);

const selectedPreview = React.useMemo(
  () => findPreviewByCode(previews, selectedCode),
  [previews, selectedCode],
);

const previewsByCode = React.useMemo(
  () => new globalThis.Map(previews.map((preview) => [preview.code, preview])),
  [previews],
);
```

Inside the geography render loop, derive clickability and add click behavior:

```tsx
const isVisited = countriesVisited.includes(geo.id);
const preview = previewsByCode.get(geo.id);
const isClickable = Boolean(preview);

return (
  <Geography
    key={geo.rsmKey}
    geography={geo}
    stroke="#000000"
    strokeWidth={0.5}
    onClick={() => {
      if (!preview) return;
      setSelectedCode(preview.code);
      trackSelectItem({
        section: "travel_map",
        content_type: "country",
        item_id: preview.code,
        item_name: preview.name,
      });
    }}
    onMouseMove={(e) =>
      handleMouseMove(
        e as unknown as React.MouseEvent,
        geo.properties.name,
        isVisited,
      )
    }
    onMouseLeave={handleMouseLeave}
    style={{
      default: {
        fill: isVisited ? mapColors.visited : mapColors.unvisited,
        outline: "none",
      },
      hover: {
        fill: isVisited ? mapColors.visited : mapColors.unvisitedHover,
        outline: "none",
        cursor: isClickable ? "pointer" : "default",
      },
      pressed: {
        fill: isVisited ? mapColors.visited : mapColors.unvisitedHover,
        outline: "none",
      },
    }}
  />
);
```

Render the preview strip after the legend and before the closing `motion.div`:

```tsx
{selectedPreview && (
  <div className="mt-6 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 className="text-xl font-bold text-foreground">{selectedPreview.name}</h4>
        <p className="text-sm text-muted-foreground">
          {selectedPreview.photoCount}{" "}
          {selectedPreview.photoCount === 1 ? "photo" : "photos"}
        </p>
      </div>
      <Button asChild size="sm">
        <Link
          href={`/photo-gallery?country=${encodeURIComponent(selectedPreview.galleryCategory)}`}
          aria-label={`View all ${selectedPreview.name} photos`}
          onClick={() =>
            trackSelectItem({
              section: "travel_map",
              content_type: "photo_gallery_link",
              item_id: selectedPreview.code,
              item_name: selectedPreview.name,
            })
          }
        >
          View all
        </Link>
      </Button>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
      {selectedPreview.featuredPhotos.map((photo) => (
        <div
          key={photo.id}
          className="relative h-36 min-w-56 overflow-hidden rounded-base border-2 border-border bg-background sm:min-w-0"
        >
          <Image
            src={photo.thumb || photo.src}
            alt={photo.caption || photo.location || selectedPreview.name}
            fill
            sizes="(max-width: 640px) 70vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Run focused map tests**

Run:

```bash
npm test -- sections/map --runInBand
```

Expected: map component and utility tests pass.

- [ ] **Step 5: Commit**

```bash
git add sections/map/map.tsx sections/map/map.test.tsx
git commit -m "feat: add homepage travel map teaser"
```

---

### Task 5: Gallery Query Initialization

**Files:**
- Create: `components/instagram/gallery.test.tsx`
- Modify: `components/instagram/gallery.tsx`

- [ ] **Step 1: Write failing gallery query tests**

Create `components/instagram/gallery.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import PhotoGallery from "./gallery";
import type { GalleryImage } from "../../interfaces/photo-gallery";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock("exifr", () => ({
  parse: jest.fn(),
}));

jest.mock("@/lib/gtag", () => ({
  trackSelectContent: jest.fn(),
  trackSelectItem: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const galleryItems: GalleryImage[] = [
  {
    id: "France-0",
    src: "/france.jpg",
    thumb: "/france-thumb.jpg",
    caption: "Eiffel view",
    category: "France",
    location: "Paris",
  },
  {
    id: "Sweden-0",
    src: "/sweden.jpg",
    thumb: "/sweden-thumb.jpg",
    caption: "Stockholm water",
    category: "Sweden",
    location: "Stockholm",
  },
];

describe("PhotoGallery", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      query: {},
    } as any);
  });

  it("initializes the active filter from a valid country query", async () => {
    mockUseRouter.mockReturnValue({
      query: { country: "France" },
    } as any);

    render(<PhotoGallery galleryItems={galleryItems} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Eiffel view")).toBeInTheDocument();
      expect(screen.queryByLabelText("Stockholm water")).not.toBeInTheDocument();
    });
  });

  it("falls back to all photos for an invalid country query", async () => {
    mockUseRouter.mockReturnValue({
      query: { country: "Atlantis" },
    } as any);

    render(<PhotoGallery galleryItems={galleryItems} />);

    expect(screen.getByLabelText("Eiffel view")).toBeInTheDocument();
    expect(screen.getByLabelText("Stockholm water")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the gallery tests and verify they fail**

Run:

```bash
npm test -- components/instagram/gallery.test.tsx --runInBand
```

Expected: the valid-query test fails because `PhotoGallery` starts with the `all` filter.

- [ ] **Step 3: Initialize gallery filter from the router query**

In `components/instagram/gallery.tsx`, add:

```ts
import { useRouter } from "next/router";
```

Inside `PhotoGallery`, add the router before state declarations:

```ts
const router = useRouter();
```

Add this effect after `categories` is defined:

```ts
useEffect(() => {
  const countryQuery = router.query.country;
  const country = Array.isArray(countryQuery) ? countryQuery[0] : countryQuery;

  if (country && categories.includes(country)) {
    setActiveFilter(country);
    return;
  }

  setActiveFilter("all");
}, [categories, router.query.country]);
```

- [ ] **Step 4: Run gallery tests and verify they pass**

Run:

```bash
npm test -- components/instagram/gallery.test.tsx --runInBand
```

Expected: the gallery query tests pass.

- [ ] **Step 5: Run map and page tests**

Run:

```bash
npm test -- sections/map components/instagram __tests__/pages/index.test.tsx --runInBand
```

Expected: map, gallery, and homepage tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/instagram/gallery.tsx components/instagram/gallery.test.tsx
git commit -m "feat: initialize gallery from country query"
```

---

### Task 6: Full Verification

**Files:**
- Inspect all changed files from Tasks 1-5.

- [ ] **Step 1: Run the full Jest suite**

Run:

```bash
npm test
```

Expected: all Jest suites pass.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: Next.js build completes successfully.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: lint passes. If lint fails only on generated `.worktrees/**/.next/**` files, fix the ignore pattern in `eslint.config.js` in a separate `chore:` commit or remove those generated directories before re-running lint.

- [ ] **Step 4: Manual browser verification**

Run the dev server:

```bash
npm run dev
```

Open the homepage and verify:

- Croatia is highlighted and selected by default.
- The preview strip appears below the map.
- Clicking France updates the preview strip to France.
- India or another visited country without gallery metadata stays highlighted but does not change the preview strip.
- `View all` from Croatia navigates to `/photo-gallery?country=Croatia`.
- The gallery initially shows only Croatia photos after that navigation.

- [ ] **Step 5: Final status check**

Run:

```bash
git status --short
```

Expected: only intentional source changes are present, and generated build artifacts are not staged.
