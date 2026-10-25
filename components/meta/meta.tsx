import Head from "next/head";
import { useRouter } from "next/router";
import type { Blog } from "../../interfaces/blog";

export interface MetaProps {
  title: string;
  desc: string;
  name: string;
  image?: string;
  url?: string;
  twitterHandle?: string;
  manifest?: string;
  themeColor?: string;
  author?: string;
  article?: Pick<Blog, "title" | "date" | "updated_at" | "published_at">;
  profiles?: string[];
}

const Meta = ({ title, desc, url, image, name, twitterHandle, manifest, themeColor, author, article, profiles }: MetaProps) => {
  const router = useRouter();
  const origin = url?.replace(/\/+$/, "");
  const path = router.asPath.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const localizedPath = router.locale === "hi" ? `/hi${path === "/" ? "" : path}` : path;
  // Posts have English content in both locales, so only the English URL is indexed.
  const canonicalPath = article ? path : localizedPath;
  const canonical = origin && new URL(canonicalPath, `${origin}/`).toString();
  const alternate = (locale: "en" | "hi") => origin && new URL(locale === "hi" ? `/hi${path === "/" ? "" : path}` : path, `${origin}/`).toString();
  const schema = origin && (article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: desc,
        image,
        datePublished: article.published_at || article.date,
        ...(article.updated_at && { dateModified: article.updated_at }),
        author: { "@type": "Person", name: author || name, url: origin },
        mainEntityOfPage: canonical,
      }
    : path === "/"
      ? { "@context": "https://schema.org", "@type": "Person", name, url: origin, image, sameAs: profiles }
      : null);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {router.pathname === "/dev" && <meta name="robots" content="noindex,follow" />}
      {author && <meta name="author" content={author} />}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={name} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
      {image && <meta name="twitter:image" content={image} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}
      <link rel="icon" href="/favicon.ico" />
      {canonical && <link rel="canonical" href={canonical} />}
      {!article && origin && <>
        <link rel="alternate" hrefLang="en" href={alternate("en")} />
        <link rel="alternate" hrefLang="hi" href={alternate("hi")} />
        <link rel="alternate" hrefLang="x-default" href={alternate("en")} />
      </>}
      {manifest && <link rel="manifest" href={manifest} />}
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />}
    </Head>
  );
};

export default Meta;
