import type { GetServerSideProps } from "next";
import { getBlogs } from "../lib/data";
import { SITE_URL } from "../lib/site-url";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const blogs = await getBlogs();

  const paths = ["/", "/hi", "/blog", "/hi/blog", "/photo-gallery", "/hi/photo-gallery"];
  for (const blog of blogs) {
    if (blog.type === "blogs" && !blog.hidden && blog.link && !blog.link.startsWith("http")) {
      paths.push(`/blog/${encodeURIComponent(blog.link)}`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${new URL(path, `${SITE_URL}/`).toString().replace(/&/g, "&amp;")}</loc></url>`).join("\n")}\n</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(xml);
  return { props: {} };
};

export default function Sitemap() { return null; }
