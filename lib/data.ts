// SERVER-ONLY: Do NOT import this file in client components.
// Only use inside getStaticProps / getServerSideProps / API routes.

import fs from "fs";
import path from "path";
import type { SiteData } from "../interfaces/site-data";
import type { About } from "../interfaces/about";
import type { Blog, BlogCard } from "../interfaces/blog";
import type { GalleryImage } from "../interfaces/photo-gallery";

const DATA_DIR = path.join(process.cwd(), "data");

function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`[data] Missing required file: ${filePath}`);
    }
    throw err;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (err: any) {
    throw new Error(`[data] Malformed JSON in ${filePath}: ${err.message}`);
  }
}

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
  return readJsonFile<SiteData>("site.json");
}

export async function getAboutData(): Promise<About> {
  return readJsonFile<About>("about.json");
}

export async function getBlogs(): Promise<BlogCard[]> {
  const raw = readJsonFile<(BlogCard & Partial<Blog>)[]>("blogs.json");
  return raw.map(toBlogCard);
}

export async function getBlogByLink(link: string): Promise<Blog | null> {
  const raw = readJsonFile<Blog[]>("blogs.json");
  const entry = raw.find((b) => b.link === link);
  if (!entry) return null;
  return entry;
}

export async function getGalleryItems(): Promise<GalleryImage[]> {
  return readJsonFile<GalleryImage[]>("gallery.json");
}

