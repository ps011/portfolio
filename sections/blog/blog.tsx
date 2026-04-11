"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogCard from "../../components/blog-card";
import Section from "../../components/tailwind/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BlogCard as BlogCardData } from "../../interfaces/blog";

const kebabCaseToSentenceCase = (str: string) =>
  str
    .split("-")
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ");

const groupBy = (xs: BlogCardData[], f: (blog: BlogCardData) => string) =>
  xs.reduce(
    (r, v) => {
      const k = f(v);
      (r[k] || (r[k] = [])).push(v);
      return r;
    },
    {} as Record<string, BlogCardData[]>,
  );

function BlogCarousel({ blogs }: { blogs: BlogCardData[] }) {
  const t = useTranslations("blog");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div>
      <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
        <CarouselContent>
          {blogs.map((blog, index) => (
            <CarouselItem
              key={blog.link ?? index}
              className="md:basis-1/2 lg:basis-1/5"
            >
              <BlogCard
                {...blog}
                tags={Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Controls: prev | dots | next — all below the slides */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
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

          <div className="flex gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                aria-label={t("goToSlide", { number: i + 1 })}
                className={cn(
                  "h-2.5 rounded-full border-2 border-border shadow-[1px_1px_0px_0px_#000000] transition-all duration-200",
                  i === current ? "w-6 bg-main" : "w-2.5 bg-secondary-background",
                )}
              />
            ))}
          </div>

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
        </div>
      )}
    </div>
  );
}

const Blog = ({ blogs }: { blogs: BlogCardData[] }) => {
  const sortedBlogs = blogs
    .filter((blog) => !blog.hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const result = groupBy(sortedBlogs, (c) => c.type);

  return (
    <>
      {Object.keys(result).map((sectionName) => (
        <Section
          container
          key={sectionName}
          id="blog-posts"
          heading={kebabCaseToSentenceCase(sectionName)}
        >
          <BlogCarousel blogs={result[sectionName]} />
        </Section>
      ))}
    </>
  );
};

export default Blog;
