import React from "react";
import { Header } from "../header/header";
import Footer from "../../sections/footer/footer";
import Meta from "../meta/meta";
import { SmoothScroll } from "../smooth-scroll";
import { useRouter } from "next/router";
import type { Blog } from "../../interfaces/blog";

interface LayoutProps {
  children: React.ReactNode;
  data?: {
    meta?: any;
    header?: any;
  };
  about?: {
    name?: string;
    profiles?: { name: string; url: string }[];
  };
  messages?: any;
  blogPost?: Blog;
}

const ChromeLayout: React.FC<LayoutProps> = ({
  children,
  data,
  about,
  messages,
  blogPost,
}) => {
  const router = useRouter();
  const meta = data?.meta;
  const header = data?.header;
  const profiles = about?.profiles;
  const commonMessages = messages?.common ?? {};
  const aboutMessages = messages?.about ?? {};
  const metaMessages = messages?.meta ?? {};
  const seoMessages = messages?.seo ?? {};
  const pageSeo = router.pathname === "/blog/[link]" && blogPost
    ? { title: `${blogPost.title} | Prasheel Soni`, desc: blogPost.shortDescription, image: blogPost.banner, author: blogPost.author, article: blogPost }
    : router.pathname === "/blog"
      ? { title: messages?.blogIndex?.pageTitle, desc: seoMessages.blog }
      : router.pathname === "/photo-gallery"
        ? { title: seoMessages.galleryTitle, desc: seoMessages.gallery }
        : router.pathname === "/dev"
          ? { title: seoMessages.devTitle, desc: seoMessages.dev }
          : {};

  const twitterProfile = profiles?.find(
    (p) => p.name === "twitter" || p.name === "x",
  );
  const twitterHandle = twitterProfile
    ? `@${twitterProfile.url.split("/").filter(Boolean).pop()}`
    : undefined;

  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[9999] focus:rounded-base focus:border-2 focus:border-border focus:bg-main focus:px-4 focus:py-2 focus:text-main-foreground focus:shadow-shadow"
      >
        {commonMessages.skipToMain ?? "Skip to main content"}
      </a>
      {meta && (
        <Meta
          {...meta}
          title={metaMessages.title}
          desc={metaMessages.desc}
          author={about?.name ?? aboutMessages.name}
          twitterHandle={twitterHandle}
          profiles={profiles?.map((profile) => profile.url)}
          {...pageSeo}
        />
      )}
      {header && <Header {...header} />}
      <main id="main-content">{children}</main>
      {profiles && <Footer profiles={profiles} />}
    </SmoothScroll>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, data, about, messages, blogPost }) => {
  const hasChrome = Boolean(data?.meta || data?.header || about?.profiles);

  if (!hasChrome) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <ChromeLayout data={data} about={about} messages={messages} blogPost={blogPost}>
      {children}
    </ChromeLayout>
  );
};

export default Layout;
