# Sample Blog Post

This is a sample blog post demonstrating the JSON data source functionality.

## Introduction

When `DATA_SOURCE=json`, blog content is served from local Markdown files in `data/blogs/`.
The filename (without `.md`) must match the `link` field in `data/blogs.json`.

## How It Works

1. `getBlogs()` reads metadata from `data/blogs.json`
2. `getBlogByLink(slug)` finds the metadata entry and reads `data/blogs/<slug>.md`
3. The Markdown content is passed directly to `MarkdownRenderer` (no fetch needed)

## Code Example

```typescript
// lib/data.ts
export async function getBlogByLink(link: string): Promise<Blog | null> {
  const meta = blogs.find((b) => b.link === link);
  const content = readMarkdownFile(link); // reads data/blogs/<link>.md
  return { ...meta, content };
}
```

Happy blogging!
