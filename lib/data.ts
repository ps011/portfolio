// SERVER-ONLY: Do NOT import this file in client components.
// Only use inside getStaticProps / getServerSideProps / API routes.
// Using `fs` (Node.js) — not available in browser bundles.

import fs from "fs";
import path from "path";
import type { SiteData } from "../interfaces/site-data";
import type { About } from "../interfaces/about";
import type { Blog, BlogCard } from "../interfaces/blog";
import type { GalleryImage } from "../interfaces/photo-gallery";
import type { UIConfig } from "../interfaces/ui-config";
import { DEFAULT_UI_CONFIG } from "./ui-defaults";

const DATA_DIR = path.join(process.cwd(), "data");

export function isApiMode(): boolean {
  const src = process.env.DATA_SOURCE;
  return !src || src === "api";
}

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
    throw new Error(
      `[data] Malformed JSON in ${filePath}: ${err.message}`,
    );
  }
}

function readMarkdownFile(slug: string): string {
  const filePath = path.join(DATA_DIR, "blogs", `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`[data] Missing required file: ${filePath}`);
    }
    throw err;
  }
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${process.env.BASE_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[data] GET ${endpoint} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function toBlogCard(blog: Blog): BlogCard {
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
  if (isApiMode()) {
    const arr = await apiFetch<SiteData[]>("/site-datas/");
    return arr[0];
  }
  return readJsonFile<SiteData>("site.json");
}

export async function getAboutData(): Promise<About> {
  if (isApiMode()) {
    const arr = await apiFetch<About[]>("/abouts/");
    return arr[0];
  }
  return readJsonFile<About>("about.json");
}

export async function getBlogs(): Promise<BlogCard[]> {
  if (isApiMode()) {
    const blogs = await apiFetch<Blog[]>("/blogs");
    return blogs.map(toBlogCard);
  }
  // In JSON mode, blogs.json may contain extra fields for full blog pages;
  // map to BlogCard for consistent return type.
  const raw = readJsonFile<(BlogCard & Partial<Blog>)[]>("blogs.json");
  return raw.map((b) => ({
    title: b.title ?? "",
    shortDescription: b.shortDescription ?? "",
    thumbnail: b.thumbnail ?? "",
    tags: b.tags ?? "",
    link: b.link ?? "",
    hidden: Boolean(b.hidden),
    date: b.date ?? "",
    type: b.type ?? "",
  }));
}

export async function getBlogByLink(link: string): Promise<Blog | null> {
  if (isApiMode()) {
    return apiFetch<Blog>(`/blogs/${link}`);
  }
  const raw = readJsonFile<(BlogCard & Partial<Blog>)[]>("blogs.json");
  const meta = raw.find((b) => b.link === link);
  if (!meta) return null;
  const content = readMarkdownFile(link);
  return { ...meta, content } as Blog;
}

export async function getGalleryItems(): Promise<GalleryImage[]> {
  if (isApiMode()) {
    const galleries = await apiFetch<
      {
        title: string;
        location?: string;
        images?: { src: string; caption: string }[];
      }[]
    >("/photo-galleries/");
    return galleries.flatMap((gallery) =>
      (gallery.images || []).map((img, idx) => ({
        id: `${gallery.title}-${idx}`,
        src: img.src,
        thumb: img.src,
        caption: img.caption,
        category: gallery.title,
        location: gallery.location,
      })),
    );
  }
  return readJsonFile<GalleryImage[]>("gallery.json");
}

export async function getUIConfig(): Promise<UIConfig> {
  const filePath = path.join(DATA_DIR, "ui.json");
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn("[data] ui.json not found, using default UI config");
      return DEFAULT_UI_CONFIG;
    }
    throw err;
  }
  try {
    return JSON.parse(raw) as UIConfig;
  } catch (err: any) {
    throw new Error(
      `[data] Malformed JSON in ${filePath}: ${err.message}`,
    );
  }
}
