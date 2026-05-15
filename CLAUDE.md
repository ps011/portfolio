# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project at a glance

- **Framework:** Next.js (Pages Router) + TypeScript + Tailwind CSS
- **i18n:** `next-intl` with locales in `messages/{en,hi}.json`
- **Tests:** Jest + React Testing Library (`jest-environment-jsdom`)
- **Path alias:** `@/*` → repo root (configured in `tsconfig.json` and `jest.config.ts`)
- **Data layer:** `lib/data.ts` (server-only). `DATA_SOURCE=api` uses `BASE_URL`; `DATA_SOURCE=json` reads `data/*.json` + `data/blogs/*.md`. Never import in client components.
- **Node:** `>=24.0.0` (use `.nvmrc`)

## Testing requirement

**After every code change, run the relevant tests and ensure they pass before reporting the task as complete.**

- Run focused tests: `npm test -- <path-or-pattern>`  e.g. `npm test -- sections/about`
- Run the full suite before finishing a feature/fix: `npm test`
- Don't skip, comment out, or `xit`/`xdescribe` failing tests to make them pass.
- If no test covers a non-trivial change (logic, data transforms, edge cases), add one.
- For UI-only changes that Jest can't cover, verify in the browser and state so explicitly.

## Commands

| Purpose | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build (also catches TS errors) | `npm run build` |
| Start prod build | `npm start` |
| Lint | `npm run lint` |
| Lint + autofix | `npm run lint:fix` |
| Run all tests | `npm test` |
| Run tests for a file/pattern | `npm test -- <path>` |
| Watch tests | `npm run test:watch` |
| Coverage report | `npm run test:coverage` |
| Conventional commit (commitizen) | `npm run commit` |
| Release (standard-version) | `npm run release` (or `npm run release:dry`) |

## Conventions

### Commits
- Conventional Commits enforced by `commitlint` + `husky`. Use `npm run commit` or write messages like `feat(about): add bio fallback`.
- Allowed types: `feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert`.
- Header max length: 100 chars. No trailing period. Don't use pascal-case/upper-case subjects.

### Code
- Server-only files (`lib/data.ts`) use `fs` — never import them from client components.
- For HTML strings in translations, use `t.raw(key)` (not `t(key)`) — next-intl interprets `<tag>` as a rich-text placeholder.
- `ui.json` has a soft fallback (returns `DEFAULT_UI_CONFIG` if missing); other data files throw on missing.
- Don't add comments explaining WHAT the code does — only WHY when non-obvious.

### Testing
- `__mocks__/next-intl.tsx` provides `useTranslations`, `useLocale`, `useMessages`, `NextIntlClientProvider`. If you add a new API surface from `next-intl`, extend this mock.
- Tests live next to source as `*.test.tsx` (or under `__tests__/`).

## Pre-PR checklist

1. `npm run lint:fix`
2. `npm test`
3. `npm run build` (verifies types + that all pages still generate)
4. Verify the change in the browser if UI-facing.
