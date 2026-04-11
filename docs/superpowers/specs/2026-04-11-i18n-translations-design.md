# i18n / Translations Design Spec

## Overview

Add internationalization support to the portfolio using **next-intl** with **Next.js subpath routing**. Phase 1 focuses on extracting hardcoded UI strings and wiring up the translation infrastructure. The site starts with English only; adding a language later requires one config entry and one JSON file.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Library | next-intl | Battle-tested, Pages Router support, interpolation/pluralization built in |
| Routing | Subpath (`/en/`, `/es/`) | SEO-friendly, built into Next.js Pages Router |
| File structure | One JSON per language (`messages/en.json`) | Simple, easy to hand off to translators |
| Language switcher | Footer | Low-profile, appropriate for a portfolio |
| Scope | UI strings only (Phase 1) | CMS content migrates later |

## Architecture

### Routing

Next.js built-in i18n routing via `next.config.js`:

```js
i18n: {
  locales: ["en"],
  defaultLocale: "en",
}
```

- `/` serves the default locale (English)
- Adding `"es"` to `locales` array automatically creates `/es/`, `/es/blog/my-post`, etc.
- `context.locale` available in `getStaticProps`
- `router.locale` available on the client

### Provider Setup

`_app.tsx` wraps the app with `NextIntlClientProvider`:

```tsx
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";

// Inside App component:
const router = useRouter();

<NextIntlClientProvider locale={router.locale} messages={pageProps.messages}>
  {/* existing providers (UIConfigProvider, ThemeProvider, etc.) */}
</NextIntlClientProvider>
```

### Message Loading

Every page's `getStaticProps` loads the locale's messages:

```tsx
export async function getStaticProps(context) {
  const messages = (await import(`../messages/${context.locale}.json`)).default;
  return {
    props: {
      // ...existing props
      messages,
    },
  };
}
```

### Translation File

`messages/en.json` — flat file with namespaced keys:

```json
{
  "common": {
    "readMore": "Read more",
    "skipToMain": "Skip to main content",
    "menu": "Menu",
    "openNav": "Open navigation menu",
    "comingSoon": "Coming Soon"
  },
  "banner": {
    "greeting": "Hi, I'm"
  },
  "experience": {
    "title": "Experience"
  },
  "interests": {
    "viewBlog": "View My Blog Posts",
    "viewGallery": "Explore Photo Gallery",
    "viewGithub": "View My GitHub"
  },
  "blog": {
    "sharePost": "Share this Post:",
    "loading": "Loading blog post...",
    "prevSlide": "Previous slide",
    "nextSlide": "Next slide"
  },
  "footer": {
    "thanks": "Thank you for stopping by!",
    "getInTouch": "Let's get in touch on any of these platforms.",
    "license": "License"
  }
}
```

Components access strings via namespace:

```tsx
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations("footer");
  return <p>{t("thanks")}</p>;
}
```

### Language Switcher

A component in the footer that renders links for each available locale:

```tsx
import Link from "next/link";
import { useRouter } from "next/router";

function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale: currentLocale, asPath } = router;

  // Don't render if only one locale is configured
  if (!locales || locales.length <= 1) return null;

  return (
    <div>
      {locales.map((locale) => (
        <Link key={locale} href={asPath} locale={locale}>
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
```

The switcher is invisible with a single locale and appears automatically when a second locale is added.

## Components to Update

These components have hardcoded strings that need extraction:

| Component | Strings to extract |
|-----------|-------------------|
| `components/layout/Layout.tsx` | "Skip to main content" |
| `components/header/header.tsx` | "Menu", "Open navigation menu" |
| `components/card/card.tsx` | "Read more" |
| `sections/banner/banner.tsx` | "Hi, I'm" |
| `sections/experience/experience.tsx` | "Experience" heading |
| `sections/interests/interests.tsx` | CTA button texts ("View My Blog Posts", etc.), "Coming Soon" |
| `sections/blog/blog.tsx` | Carousel control labels |
| `sections/footer/footer.tsx` | "Thank you for stopping by!", "Let's get in touch...", "License" |
| `pages/blog/[link].tsx` | "Share this Post:", "Loading blog post..." |

## Pages Requiring getStaticProps Changes

| Page | Change |
|------|--------|
| `pages/index.tsx` | Add `messages` to props |
| `pages/blog/[link].tsx` | Add `messages` to props |
| `pages/photo-gallery/index.tsx` | Add `messages` to props |
| `pages/dev/index.tsx` | Add `messages` to props (if it has translatable strings) |

## What Does NOT Change

- Theme system (independent of locale)
- Lenis smooth scroll / Framer Motion animations
- Blog markdown rendering (content stays in authored language)
- Photo gallery, map section data
- Data fetching from CMS (untouched in Phase 1)
- UIConfig system (coexists with translations; UIConfig handles layout/behavior, translations handle text)

## Phasing

### Phase 1: Foundation (this work)
- Install `next-intl`
- Configure `next.config.js` with `i18n` object
- Set up `NextIntlClientProvider` in `_app.tsx`
- Create `messages/en.json` with all extracted UI strings
- Update `getStaticProps` on all pages to load messages
- Replace hardcoded strings in all components with `useTranslations`
- Add `LanguageSwitcher` component in footer (hidden when single locale)

### Phase 2: Add a second language (future)
- Add locale to `next.config.js` (e.g., `locales: ["en", "es"]`)
- Create `messages/es.json` with translated strings
- Language switcher becomes visible

### Phase 3: CMS content migration (future)
- Move CMS data to locale-aware local JSON (`data/en/site.json`, `data/es/site.json`)
- Update `lib/data.ts` to accept a `locale` parameter
- Pass `context.locale` from `getStaticProps` into data-fetching functions

## Testing

- Existing tests should continue passing (English strings don't change, just their source)
- Add a test for the `LanguageSwitcher` component (renders nothing with one locale, renders links with multiple)
- Verify `getStaticProps` correctly loads messages for the locale
