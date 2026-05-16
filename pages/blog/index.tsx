import Head from "next/head";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import BlogIndex from "../../sections/blog-index/blog-index";
import { getSiteData, getAboutData, getBlogs } from "../../lib/data";
import type { BlogCard as BlogCardData } from "../../interfaces/blog";

interface BlogIndexPageProps {
  blogs: BlogCardData[];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const [siteData, aboutData, allBlogs] = await Promise.all([
    getSiteData(),
    getAboutData(),
    getBlogs(),
  ]);

  if (!siteData) {
    console.error("BlogIndexPage: Error fetching site data.");
    return { notFound: true };
  }

  if (!aboutData) {
    console.error("BlogIndexPage: Error fetching about data.");
    return { notFound: true };
  }

  const blogs = (allBlogs ?? [])
    .filter((b) => b.type === "blogs" && !b.hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      siteData,
      aboutData,
      blogs,
      messages: (await import(`../../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
};

const BlogIndexPage = ({ blogs }: BlogIndexPageProps) => {
  const t = useTranslations("blogIndex");
  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <BlogIndex blogs={blogs} />
    </>
  );
};

export default BlogIndexPage;
