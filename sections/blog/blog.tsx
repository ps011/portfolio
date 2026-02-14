"use client";

import Card from "../../components/card/card";
import Section from "../../components/tailwind/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Blog as BlogType } from "../../interfaces/blog";

const Blog = ({ blogs }: { blogs: BlogType[] }) => {
  const sortedBlogs = blogs
    .filter((blog) => !blog.hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupBy = (xs: BlogType[], f: (blog: BlogType) => string) =>
    xs.reduce((r, v) => {
      const k = f(v);
      (r[k] || (r[k] = [])).push(v);
      return r;
    }, {} as Record<string, BlogType[]>);

  const kebabCaseToSentenceCase = (str: string) =>
    str
      .split("-")
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(" ");

  const result = groupBy(sortedBlogs, (c) => c.type);

  return (
    <>
      {Object.keys(result).length > 0 &&
        Object.keys(result).map((sectionName) => (
          <Section
            container
            key={sectionName}
            id="blog-posts"
            heading={kebabCaseToSentenceCase(sectionName)}
          >
            <Carousel
              opts={{ align: "start", loop: true }}
            >
              <CarouselContent className="ml-2 md:ml-4">
                {result[sectionName]?.map((blog, index) => (
                  <CarouselItem
                    key={blog.link ?? index}
                    className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/4"
                  >
                    <Card
                      {...blog}
                      tags={
                        Array.isArray(blog.tags)
                          ? blog.tags.join(", ")
                          : blog.tags
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Section>
        ))}
    </>
  );
};

export default Blog;
