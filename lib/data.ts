// SERVER-ONLY: Do NOT import this file in client components.
// Only use inside getStaticProps / getServerSideProps / API routes.

import type { SiteData } from "../interfaces/site-data";
import type { About } from "../interfaces/about";
import type { Blog, BlogCard } from "../interfaces/blog";
import type { GalleryImage } from "../interfaces/photo-gallery";
import { readContentFile } from "./content-source";

function toBlogCard(blog: BlogCard & Partial<Blog>): BlogCard {
  return {
    title: blog.title ?? "",
    shortDescription: blog.shortDescription ?? "",
    thumbnail: blog.thumbnail ?? "",
    tags: blog.tags ?? "",
    link: blog.link ?? "",
    hidden: Boolean(blog.hidden),
    date: blog.date ?? "",
    type: blog.type ?? "",
  };
}

export async function getSiteData(): Promise<SiteData> {
  return readContentFile<SiteData>("site.json");
}

export async function getAboutData(): Promise<About> {
  return readContentFile<About>("about.json");
}

export async function getBlogs(): Promise<BlogCard[]> {
  const raw = await readContentFile<(BlogCard & Partial<Blog>)[]>("blogs.json");
  return raw.map(toBlogCard);
}

export async function getBlogByLink(link: string): Promise<Blog | null> {
  const raw = await readContentFile<Blog[]>("blogs.json");
  const entry = raw.find((b) => b.link === link);
  if (!entry) return null;
  return entry;
}

export async function getGalleryItems(): Promise<GalleryImage[]> {
  return readContentFile<GalleryImage[]>("gallery.json");
}
