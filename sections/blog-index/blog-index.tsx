"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import BlogCard from "../../components/blog-card";
import { Button } from "@prasheel/ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trackSearch, trackSelectItem } from "@/lib/gtag";
import type { BlogCard as BlogCardData } from "../../interfaces/blog";

const ALL_TAG = "all";

const normalizeTags = (tags: BlogCardData["tags"] | string[]): string[] => {
  if (!tags) return [];
  const raw = Array.isArray(tags) ? tags : tags.split(",");
  return raw.map((t) => t.trim()).filter(Boolean);
};

const BlogIndex = ({ blogs }: { blogs: BlogCardData[] }) => {
  const t = useTranslations("blogIndex");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);
  const deferredQuery = useDeferredValue(query);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const b of blogs) {
      normalizeTags(b.tags).forEach((tag) => set.add(tag));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return blogs.filter((b) => {
      const blogTags = normalizeTags(b.tags);
      const matchesTag = activeTag === ALL_TAG || blogTags.includes(activeTag);
      if (!matchesTag) return false;
      if (!q) return true;
      const title = (b.title ?? "").toLowerCase();
      const desc = (b.shortDescription ?? "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [blogs, deferredQuery, activeTag]);

  const handleSearchChange = (nextQuery: string) => {
    setQuery(nextQuery);
    trackSearch({
      section: "blog_index",
      search_term: nextQuery.trim(),
    });
  };

  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    trackSelectItem({
      section: "blog_index",
      content_type: "tag",
      item_id: tag,
      item_name: tag === ALL_TAG ? t("allTag") : tag,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </header>

        <div className="mx-auto mb-8 w-full max-w-xl">
          <label htmlFor="blog-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/70"
            />
            <Input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-10"
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              key={ALL_TAG}
              variant={activeTag === ALL_TAG ? "default" : "neutral"}
              size="sm"
              onClick={() => handleTagChange(ALL_TAG)}
            >
              {t("allTag")}
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "default" : "neutral"}
                size="sm"
                onClick={() => handleTagChange(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div
            className={cn(
              "grid gap-6",
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {filtered.map((blog) => (
              <BlogCard
                key={blog.link ?? blog.title}
                thumbnail={blog.thumbnail}
                title={blog.title}
                shortDescription={blog.shortDescription}
                tags={Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags}
                link={blog.link}
              />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            {t("noResults")}
          </p>
        )}
      </main>
    </div>
  );
};

export default BlogIndex;
