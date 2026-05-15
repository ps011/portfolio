# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix (also runs as pre-commit hook)
npm test             # Run all Jest tests
npm run test:watch   # Jest in watch mode
npm run test:coverage # Jest with coverage
npx tsc --noEmit     # TypeScript type-check (no output)
```

Node >= 24.0.0 required (version pinned in `.nvmrc`).

## Code Style

- **Double quotes**, **semicolons required**, **trailing commas** (enforced by ESLint flat config)
- Conventional commits enforced by commitlint hook: `feat:`, `fix:`, `chore:`, etc. (max 100 char header)
- Husky pre-commit runs `lint:fix`; commit-msg runs `commitlint`

## Architecture

**Next.js Pages Router** with TypeScript, Tailwind CSS, and Framer Motion.

### Dual Data Source

Controlled by `DATA_SOURCE` env var:
- `DATA_SOURCE=api` (default) — fetches from `BASE_URL` API endpoint
- `DATA_SOURCE=json` — reads from local `data/*.json` + `data/blogs/*.md`

All data access goes through `lib/data.ts` (uses `fs` — **server-only, never import in client components**). Functions: `getSiteData`, `getAboutData`, `getBlogs`, `getBlogByLink`, `getGalleryItems`, `getUIConfig`.

### Rendering

SSG via `getStaticProps` with ISR (1-hour revalidation). Dynamic blog routes use `getStaticPaths`.

### UIConfig Flow

`getStaticProps` → `pageProps.uiConfig` → `_app.tsx UIConfigProvider` → `useUIConfig()` in components. Defaults in `lib/ui-defaults.ts`; `data/ui.json` has soft fallback (returns defaults if file missing).

### Theme System

16 color presets with dark mode. Context in `lib/theme-context.tsx`, CSS variables applied to `:root`. Inline script in `_document.tsx` prevents FOUC by reading localStorage (`portfolio-theme`, `portfolio-dark-mode`) before paint. Color definitions in `styles/theme-config.js`.

### Smooth Scroll + Animations

- **Lenis** (`components/smooth-scroll.tsx`) wraps the app for smooth scrolling
- **Framer Motion** `useScroll`/`useTransform` for scroll-linked parallax (banner section)
- Respects `prefers-reduced-motion` via `useReducedMotion` hook throughout

### Key Directories

- `sections/` — Page-level sections (Banner, About, Experience, Blog, Map, Footer, Interests)
- `components/ui/` — shadcn/ui components (new-york style, non-RSC, Lucide icons)
- `interfaces/` — TypeScript type definitions for data models
- `styles/theme-config.js` — Color palette definitions for all 16 themes × light/dark

### Path Alias

`@/*` maps to project root (e.g., `@/components/...`, `@/lib/...`).

## Testing

Jest with jsdom + React Testing Library. Tests in `__tests__/` and colocated `*.test.ts` files. `jest.setup.ts` mocks IntersectionObserver, ResizeObserver, matchMedia, Web Animations API (needed for Framer Motion scroll hooks), and `window.scrollTo`.

## CI Pipeline

GitHub Actions (`ci.yml`) on PRs to main: lint → test --ci → tsc --noEmit → build → verify `.next/` exists → bundle size check.

## Release Process

Automated via `deploy.yml`: PR label or manual dispatch triggers version bump (standard-version), release branch creation, merge to main, and git tag. Do not manually edit `CHANGELOG.md` or version in `package.json`.
