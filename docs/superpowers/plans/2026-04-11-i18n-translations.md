# i18n Translations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add next-intl i18n infrastructure with subpath routing, extract all hardcoded UI strings into a translation file, and add a footer language switcher.

**Architecture:** Next.js built-in i18n routing (`next.config.js` `i18n` object) + `next-intl` for translation management. Messages loaded per-locale in `getStaticProps`, served to components via `NextIntlClientProvider` and `useTranslations` hook. Language switcher in footer, hidden when only one locale is configured.

**Tech Stack:** next-intl, Next.js Pages Router i18n routing

**Spec:** `docs/superpowers/specs/2026-04-11-i18n-translations-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `messages/en.json` | Create | All UI strings organized by namespace |
| `next.config.js` | Modify | Add `i18n` config object |
| `pages/_app.tsx` | Modify | Wrap with `NextIntlClientProvider` |
| `pages/index.tsx` | Modify | Load messages in `getStaticProps` |
| `pages/blog/[link].tsx` | Modify | Load messages in `getStaticProps`, replace hardcoded strings |
| `pages/photo-gallery/index.tsx` | Modify | Load messages in `getStaticProps` |
| `pages/dev/index.tsx` | Modify | Load messages in `getStaticProps` |
| `components/layout/Layout.tsx` | Modify | Replace "Skip to main content" with `useTranslations` |
| `components/header/header.tsx` | Modify | Replace "Menu", aria-label with `useTranslations` |
| `components/card/card.tsx` | Modify | Replace "Read more" with `useTranslations` |
| `sections/banner/banner.tsx` | Modify | Replace "Hi, I'm" with `useTranslations` |
| `sections/experience/experience.tsx` | Modify | Replace "Experience" heading with `useTranslations` |
| `sections/interests/interests.tsx` | Modify | Replace CTA strings with `useTranslations` |
| `sections/blog/blog.tsx` | Modify | Replace carousel aria-labels with `useTranslations` |
| `sections/footer/footer.tsx` | Modify | Replace hardcoded strings, add `LanguageSwitcher` |
| `components/language-switcher/language-switcher.tsx` | Create | Language switcher component |
| `__tests__/components/language-switcher.test.tsx` | Create | Tests for language switcher |

---

### Task 1: Install next-intl and configure routing

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `next.config.js:1-22`

- [ ] **Step 1: Install next-intl**

Run: `npm install next-intl`

- [ ] **Step 2: Add i18n config to next.config.js**

In `next.config.js`, add the `i18n` property to the exported config object:

```js
const path = require("path");

module.exports = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
  compiler: {
    emotion: false,
  },
};
```

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts without errors. Visit `http://localhost:3000` — page loads normally.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.js
git commit -m "feat(i18n): install next-intl and configure i18n routing"
```

---

### Task 2: Create translation file and wire up provider

**Files:**
- Create: `messages/en.json`
- Modify: `pages/_app.tsx:1-31`

- [ ] **Step 1: Create messages/en.json**

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
    "nextSlide": "Next slide",
    "goToSlide": "Go to slide {number}"
  },
  "footer": {
    "thanks": "Thank you for stopping by!",
    "getInTouch": "Let's get in touch on any of these platforms.",
    "license": "License"
  }
}
```

- [ ] **Step 2: Wrap app with NextIntlClientProvider in _app.tsx**

```tsx
import "../styles/global.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "../lib/theme-context";
import Layout from "../components/layout/Layout";

const isProduction = process.env.NODE_ENV === "production";

export default function Portfolio({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isProduction) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const { siteData, aboutData, messages, ...restPageProps } = pageProps;

  return (
    <NextIntlClientProvider locale={router.locale} messages={messages}>
      <ThemeProvider>
        <Layout data={siteData} about={aboutData}>
          <Component {...restPageProps} aboutData={aboutData} />
        </Layout>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 3: Verify dev server still runs**

Run: `npm run dev`
Expected: No errors. Page renders as before (messages not loaded yet — provider receives `undefined`, which is fine for now).

- [ ] **Step 4: Commit**

```bash
git add messages/en.json pages/_app.tsx
git commit -m "feat(i18n): create en.json messages and wire up NextIntlClientProvider"
```

---

### Task 3: Load messages in all getStaticProps

**Files:**
- Modify: `pages/index.tsx:22-56` (getStaticProps)
- Modify: `pages/blog/[link].tsx:8-49` (getStaticProps)
- Modify: `pages/photo-gallery/index.tsx:4-45` (getStaticProps)
- Modify: `pages/dev/index.tsx:5-31` (getStaticProps)

- [ ] **Step 1: Update pages/index.tsx getStaticProps**

Add `context` parameter and load messages. Change the function signature and add messages to props:

```tsx
export async function getStaticProps(context) {
  const [siteDataRes, aboutRes, blogsRes] = await Promise.all([
    fetch(`${process.env.BASE_URL}/site-datas/`),
    fetch(`${process.env.BASE_URL}/abouts/`),
    fetch(`${process.env.BASE_URL}/blogs`),
  ]);

  const [siteDataArray, aboutDataArray, blogsData] = await Promise.all([
    siteDataRes.json(),
    aboutRes.json(),
    blogsRes.json() as Promise<tBlog[]>,
  ]);

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("HomePage: Error fetching site data or siteData[0] is missing.");
    return { notFound: true };
  }
  const site = siteDataArray[0];

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("HomePage: Error fetching about data or aboutData[0] is missing.");
    return { notFound: true };
  }
  const about = aboutDataArray[0];

  return {
    props: {
      siteData: site,
      aboutData: about,
      bannerData: site.banner,
      blogs: blogsData.map(toBlogCard),
      messages: (await import(`../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
}
```

- [ ] **Step 2: Update pages/blog/[link].tsx getStaticProps**

Add messages to the props return:

```tsx
export async function getStaticProps(context) {
    const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
    const siteDataArray = await siteDataRes.json();

    const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
    const aboutDataArray = await aboutRes.json();

    let blogPostData = {};
    if (context.params.link && !context.params.link.startsWith("http")) {
        const blogPostRes = await fetch(`${process.env.BASE_URL}/blogs/${context.params.link}`);
        blogPostData = await blogPostRes.json();
        if (Object.keys(blogPostData).length === 0) {
             console.error(`Blog [${context.params.link}]: Blog post not found or empty.`);
            return { notFound: true };
        }
    } else {
        return { notFound: true };
    }

    if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
        console.error(`Blog [${context.params.link}]: Error fetching site data.`);
        return { notFound: true };
    }
    const site = siteDataArray[0];

    if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
        console.error(`Blog [${context.params.link}]: Error fetching about data.`);
        return { notFound: true };
    }
    const about = aboutDataArray[0];

    return {
        props: {
            siteData: site,
            aboutData: about,
            blogPost: blogPostData,
            messages: (await import(`../../messages/${context.locale}.json`)).default,
        },
        revalidate: 3600,
    };
}
```

- [ ] **Step 3: Update pages/photo-gallery/index.tsx getStaticProps**

Add `context` parameter and messages to props:

```tsx
export async function getStaticProps(context) {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  const photoGalleriesRes = await fetch(`${process.env.BASE_URL}/photo-galleries/`);
  const photoGalleries = await photoGalleriesRes.json();
  const galleryItems = photoGalleries.flatMap((gallery) =>
    (gallery.images || []).map((img, idx) => ({
      id: `${gallery.title}-${idx}`,
      src: img.src,
      thumb: img.src,
      caption: img.caption,
      category: gallery.title,
      location: gallery.location,
    })),
  );

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("PhotoGalleryPage: Error fetching site data.");
    return { notFound: true };
  }
  const site = siteDataArray[0];

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("PhotoGalleryPage: Error fetching about data.");
    return { notFound: true };
  }
  const about = aboutDataArray[0];

  return {
    props: {
      siteData: site,
      aboutData: about,
      galleryItems,
      messages: (await import(`../../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
}
```

- [ ] **Step 4: Update pages/dev/index.tsx getStaticProps**

Add `context` parameter and messages to props:

```tsx
export const getStaticProps: GetStaticProps = async (context) => {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("DevPage: Error fetching site data.");
    return { notFound: true };
  }
  const site = siteDataArray[0];

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("DevPage: Error fetching about data.");
    return { notFound: true };
  }
  const about = aboutDataArray[0];

  return {
    props: {
      siteData: site,
      aboutData: about,
      messages: (await import(`../../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
};
```

- [ ] **Step 5: Verify the build passes**

Run: `npx tsc --noEmit && npm run build`
Expected: No type errors, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add pages/index.tsx pages/blog/[link].tsx pages/photo-gallery/index.tsx pages/dev/index.tsx
git commit -m "feat(i18n): load locale messages in all getStaticProps"
```

---

### Task 4: Replace hardcoded strings in layout, header, and card

**Files:**
- Modify: `components/layout/Layout.tsx:1-39`
- Modify: `components/header/header.tsx:1-98`
- Modify: `components/card/card.tsx:1-92`

- [ ] **Step 1: Update Layout.tsx — replace "Skip to main content"**

```tsx
import React from "react";
import { useTranslations } from "next-intl";
import { Header } from "../header/header";
import Footer from "../../sections/footer/footer";
import Meta from "../meta/meta";
import { SmoothScroll } from "../smooth-scroll";

interface LayoutProps {
  children: React.ReactNode;
  data: {
    meta?: any;
    header?: any;
  };
  about: {
    profiles?: any[];
  };
}

const Layout: React.FC<LayoutProps> = ({ children, data, about }) => {
  const t = useTranslations("common");
  const meta = data?.meta;
  const header = data?.header;
  const profiles = about?.profiles;

  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[9999] focus:rounded-base focus:border-2 focus:border-border focus:bg-main focus:px-4 focus:py-2 focus:text-main-foreground focus:shadow-shadow"
      >
        {t("skipToMain")}
      </a>
      {meta && <Meta {...meta} />}
      {header && <Header {...header} />}
      <main id="main-content">{children}</main>
      {profiles && <Footer profiles={profiles} />}
    </SmoothScroll>
  );
};

export default Layout;
```

- [ ] **Step 2: Update header.tsx — replace "Menu" and aria-label**

Add `useTranslations` import and hook call at the top of the component. Replace two strings:

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface HeaderProps {
  logoUrl: string;
  navMap?: Array<{ href: string; label: string }>;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl, navMap = [] }) => {
  const t = useTranslations("common");

  const getHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return `/${href}`;
  };

  const navLinks = (
    <>
      {navMap.length > 0 &&
        navMap.map((item) => (
          <Button key={item.href} variant="neutral" size="default" asChild>
            <Link href={getHref(item.href)} className="no-underline">
              {item.label}
            </Link>
          </Button>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-main py-4 shadow-shadow md:py-6">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Image
            height={56}
            width={250}
            src={logoUrl}
            alt="Logo"
            priority
            className="h-10 w-auto md:h-14"
          />
        </Link>

        <nav className="hidden lg:flex lg:items-center gap-2">
          {navLinks}
          <ThemeSwitcher />
        </nav>

        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger
              asChild
              aria-label={t("openNav")}
              className="min-h-[44px] min-w-[44px] rounded-base border-2 border-border bg-main-foreground p-2.5 text-main shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
            >
              <button type="button">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="text-left">{t("menu")}</SheetTitle>
              </SheetHeader>
              <ul className="mt-6 flex flex-col gap-2">
                {navMap.length > 0 &&
                  navMap.map((item) => (
                    <li key={item.href}>
                      <Button
                        variant="neutral"
                        size="default"
                        className="w-full justify-start text-left"
                        asChild
                      >
                        <Link href={getHref(item.href)}>{item.label}</Link>
                      </Button>
                    </li>
                  ))}
              </ul>
              <div className="mt-4">
                <ThemeSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 3: Update card.tsx — replace "Read more"**

Add `useTranslations` import and hook call. Replace the button text:

Change in `card.tsx`:
- Add `import { useTranslations } from "next-intl";` after the framer-motion import
- Add `const t = useTranslations("common");` as the first line inside the `Card` component function
- Replace `Read more` with `{t("readMore")}`

The CardFooter becomes:
```tsx
<CardFooter className="pt-0">
  <Button variant="default" size="default" className="w-full" asChild>
    <Link href={getLink(link)} target="_blank" rel="noopener noreferrer" className="no-underline">
      {t("readMore")}
    </Link>
  </Button>
</CardFooter>
```

- [ ] **Step 4: Verify types pass**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Layout.tsx components/header/header.tsx components/card/card.tsx
git commit -m "feat(i18n): replace hardcoded strings in layout, header, and card"
```

---

### Task 5: Replace hardcoded strings in banner, experience, and interests

**Files:**
- Modify: `sections/banner/banner.tsx:136-141`
- Modify: `sections/experience/experience.tsx:29-30`
- Modify: `sections/interests/interests.tsx:53-92`

- [ ] **Step 1: Update banner.tsx — replace "Hi, I'm"**

Add `import { useTranslations } from "next-intl";` after the existing imports.
Add `const t = useTranslations("banner");` as the first line inside the `Banner` component (before `timeoutRef`).

Replace the h1 content (lines 137-154). The `aria-label` and visible text both change:

```tsx
<h1
  className="text-2xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl"
  aria-label={`${t("greeting")} ${texts[0]}`}
>
  {t("greeting")}{" "}
  <span className="relative inline-block" aria-hidden="true">
    <span
      className="relative z-10 inline-block border-2 border-border bg-main px-2 py-0.5 text-main-foreground shadow-shadow md:px-3 md:py-1"
      style={{ boxShadow: "2px 2px 0px 0px #000000" }}
    >
      <span
        id="typewrite"
        className="text-main-foreground"
        data-period="2000"
        data-type={JSON.stringify(texts)}
      />
    </span>
  </span>
</h1>
```

- [ ] **Step 2: Update experience.tsx — replace "Experience" heading**

Add `import { useTranslations } from "next-intl";` after the existing imports.
Add `const t = useTranslations("experience");` inside the `Experience` component.

Replace the Section heading prop:

```tsx
<Section container id="experience" heading={t("title")}>
```

- [ ] **Step 3: Update interests.tsx — replace CTA strings**

Add `import { useTranslations } from "next-intl";` after the existing imports.
Add `const t = useTranslations("interests");` inside the `Interests` component (before `getInterestType`).
Also add `const tc = useTranslations("common");` for the "Coming Soon" string.

Replace the `getCTA` function body:

```tsx
const getCTA = (interest: { title: string; description: string }) => {
  const type = getInterestType(interest.title);
  switch (type) {
    case "blogging":
      return (
        <Button variant="default" size="default" asChild>
          <Link href="/blog" className="no-underline">
            {t("viewBlog")}
          </Link>
        </Button>
      );
    case "photography":
      return (
        <Button variant="default" size="default" asChild>
          <Link href="/photo-gallery" className="no-underline">
            {t("viewGallery")}
          </Link>
        </Button>
      );
    case "coding":
      return (
        <Button variant="default" size="default" asChild>
          <Link
            href="https://github.com/ps011"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            {t("viewGithub")}
          </Link>
        </Button>
      );
    default:
      return (
        <Button variant="neutral" size="default" disabled>
          {tc("comingSoon")}
        </Button>
      );
  }
};
```

- [ ] **Step 4: Verify types pass**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add sections/banner/banner.tsx sections/experience/experience.tsx sections/interests/interests.tsx
git commit -m "feat(i18n): replace hardcoded strings in banner, experience, and interests"
```

---

### Task 6: Replace hardcoded strings in blog section, blog page, and footer

**Files:**
- Modify: `sections/blog/blog.tsx:80-110`
- Modify: `pages/blog/[link].tsx:75-119`
- Modify: `sections/footer/footer.tsx:36-75`

- [ ] **Step 1: Update blog.tsx — replace carousel aria-labels**

Add `import { useTranslations } from "next-intl";` after the existing imports.
Add `const t = useTranslations("blog");` inside the `BlogCarousel` component (before the state declarations).

Replace three aria-labels in the carousel controls:

```tsx
<Button
  variant="noShadow"
  size="icon"
  onClick={() => api?.scrollPrev()}
  disabled={!canScrollPrev}
  aria-label={t("prevSlide")}
  className="h-9 w-9 shrink-0 rounded-base border-2 border-border disabled:opacity-40"
>
  <ArrowLeft className="size-4" />
</Button>
```

```tsx
<button
  key={i}
  onClick={() => api?.scrollTo(i)}
  aria-label={t("goToSlide", { number: i + 1 })}
  className={cn(
    "h-2.5 rounded-full border-2 border-border shadow-[1px_1px_0px_0px_#000000] transition-all duration-200",
    i === current ? "w-6 bg-main" : "w-2.5 bg-secondary-background",
  )}
/>
```

```tsx
<Button
  variant="noShadow"
  size="icon"
  onClick={() => api?.scrollNext()}
  disabled={!canScrollNext}
  aria-label={t("nextSlide")}
  className="h-9 w-9 shrink-0 rounded-base border-2 border-border disabled:opacity-40"
>
  <ArrowRight className="size-4" />
</Button>
```

- [ ] **Step 2: Update pages/blog/[link].tsx — replace "Share this Post:" and loading text**

Add `import { useTranslations } from "next-intl";` after the existing imports.
Add `const t = useTranslations("blog");` inside the `SingleBlogPage` component (after `const router = useRouter();`).

Replace the loading text:
```tsx
if (!blogPost || Object.keys(blogPost).length === 0) {
    return <p>{t("loading")}</p>;
}
```

Replace "Share this Post:":
```tsx
<span className="text-neutralGray-900 dark:text-white">{t("sharePost")}</span>
```

- [ ] **Step 3: Update footer.tsx — replace hardcoded strings**

Add `import { useTranslations } from "next-intl";` after the existing imports.
Add `const t = useTranslations("footer");` inside the `Footer` component (after `const prefersReduced = ...`).

Replace three strings:

```tsx
<h3 className="mb-2 text-2xl font-bold text-foreground">
  {t("thanks")}
</h3>
<p className="mb-4 text-foreground md:mb-0">
  {t("getInTouch")}
</p>
```

```tsx
<a
  href="https://github.com/ps011/ps11/LICENSE.md"
  target="_blank"
  rel="noreferrer"
  className="underline hover:no-underline"
>
  {t("license")}
</a>
```

- [ ] **Step 4: Verify types pass**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add sections/blog/blog.tsx pages/blog/[link].tsx sections/footer/footer.tsx
git commit -m "feat(i18n): replace hardcoded strings in blog section, blog page, and footer"
```

---

### Task 7: Create LanguageSwitcher component with tests

**Files:**
- Create: `components/language-switcher/language-switcher.tsx`
- Create: `__tests__/components/language-switcher.test.tsx`
- Modify: `sections/footer/footer.tsx` (add LanguageSwitcher)

- [ ] **Step 1: Write the failing test**

Create `__tests__/components/language-switcher.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "../../components/language-switcher/language-switcher";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, locale, ...props }: any) => (
    <a href={href} data-locale={locale} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from "next/router";
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("LanguageSwitcher", () => {
  it("renders nothing when only one locale is configured", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en"],
      locale: "en",
      asPath: "/",
    } as any);

    const { container } = render(<LanguageSwitcher />);
    expect(container.firstChild).toBeNull();
  });

  it("renders links for all locales when multiple are configured", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en", "es"],
      locale: "en",
      asPath: "/",
    } as any);

    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("ES")).toBeInTheDocument();
  });

  it("marks the current locale as active", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en", "es"],
      locale: "en",
      asPath: "/",
    } as any);

    render(<LanguageSwitcher />);
    const enLink = screen.getByText("EN");
    expect(enLink).toHaveAttribute("aria-current", "true");
    const esLink = screen.getByText("ES");
    expect(esLink).not.toHaveAttribute("aria-current");
  });

  it("passes the current path to locale links", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en", "es"],
      locale: "en",
      asPath: "/blog/my-post",
    } as any);

    render(<LanguageSwitcher />);
    const esLink = screen.getByText("ES");
    expect(esLink.closest("a")).toHaveAttribute("data-locale", "es");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/components/language-switcher.test.tsx --no-coverage`
Expected: FAIL — Cannot find module `../../components/language-switcher/language-switcher`

- [ ] **Step 3: Create the LanguageSwitcher component**

Create `components/language-switcher/language-switcher.tsx`:

```tsx
import Link from "next/link";
import { useRouter } from "next/router";

export const LanguageSwitcher = () => {
  const { locales, locale: currentLocale, asPath } = useRouter();

  if (!locales || locales.length <= 1) return null;

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={asPath}
          locale={locale}
          aria-current={locale === currentLocale ? "true" : undefined}
          className={`text-sm font-medium transition-colors ${
            locale === currentLocale
              ? "text-foreground underline"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/components/language-switcher.test.tsx --no-coverage`
Expected: PASS — all 4 tests pass.

- [ ] **Step 5: Add LanguageSwitcher to footer**

In `sections/footer/footer.tsx`, add import and render the switcher in the bottom bar:

Add import:
```tsx
import { LanguageSwitcher } from "../../components/language-switcher/language-switcher";
```

Replace the bottom `<div>` (the one with copyright and license) to include the switcher:

```tsx
<div className="flex flex-col gap-2 text-sm text-foreground sm:flex-row sm:justify-between sm:items-center">
  <span>
    &copy; {new Date().getFullYear()}{" "}
    <a
      href="https://linkedin.com/in/ps011"
      target="_blank"
      rel="noreferrer"
      className="underline hover:no-underline"
    >
      Prasheel
    </a>
  </span>
  <div className="flex items-center gap-4">
    <LanguageSwitcher />
    <a
      href="https://github.com/ps011/ps11/LICENSE.md"
      target="_blank"
      rel="noreferrer"
      className="underline hover:no-underline"
    >
      {t("license")}
    </a>
  </div>
</div>
```

- [ ] **Step 6: Run all tests**

Run: `npm test -- --no-coverage`
Expected: All tests pass.

- [ ] **Step 7: Verify dev server and visual check**

Run: `npm run dev`
Expected: Site loads normally. No language switcher visible (only 1 locale configured). All text displays correctly from translations.

- [ ] **Step 8: Commit**

```bash
git add components/language-switcher/language-switcher.tsx __tests__/components/language-switcher.test.tsx sections/footer/footer.tsx
git commit -m "feat(i18n): add LanguageSwitcher component in footer"
```

---

### Task 8: Final verification

**Files:** None (verification only)

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 2: Run tests**

Run: `npm test -- --no-coverage`
Expected: All tests pass.

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds. Check that all pages are generated.

- [ ] **Step 5: Visual verification**

Run: `npm run dev`
Verify:
- Home page loads, all text displays correctly
- "Hi, I'm" text works with typewriter animation
- "Experience" heading shows
- Interest CTAs show correct text
- Footer shows "Thank you for stopping by!" and "License"
- Blog carousel aria-labels work (inspect in devtools)
- Navigate to a blog post — "Share this Post:" displays
- No language switcher visible (correct — only 1 locale)
