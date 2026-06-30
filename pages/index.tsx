import Banner from "../sections/banner/banner";
import About from "../sections/about/about";
import Experience from "../sections/experience/experience";
import BlogSection from "../sections/blog/blog";
import YouTube from "../sections/youtube/youtube";
import { Map } from "../sections/map/map";
import type { BlogCard } from "../interfaces/blog";
import type { YouTubeVideo } from "../interfaces/youtube";
import { getSiteData, getAboutData, getBlogs } from "../lib/data";
import { getYouTubeVideos } from "../lib/youtube";

export async function getStaticProps(context) {
  const [siteData, aboutData, blogs, youtubeVideos] = await Promise.all([
    getSiteData(),
    getAboutData(),
    getBlogs(),
    getYouTubeVideos(6),
  ]);

  if (!siteData) {
    console.error("HomePage: Error fetching site data.");
    return { notFound: true };
  }

  if (!aboutData) {
    console.error("HomePage: Error fetching about data.");
    return { notFound: true };
  }

  return {
    props: {
      siteData,
      aboutData,
      bannerData: siteData.banner,
      blogs,
      youtubeVideos,
      messages: (await import(`../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
}

interface IndexPageProps {
  bannerData: any;
  aboutData: any;
  blogs: BlogCard[];
  youtubeVideos: YouTubeVideo[];
}

export default function IndexPage({
  bannerData,
  aboutData,
  blogs,
  youtubeVideos = [],
}: IndexPageProps) {
  const countriesVisited = aboutData?.countriesVisited;

  return (
    <>
      {bannerData && <Banner {...bannerData} />}
      <div>
        {aboutData && <About {...aboutData} />}
        {aboutData?.experience?.length > 0 && (
          <Experience experience={aboutData.experience} />
        )}
        {blogs && <BlogSection blogs={blogs} />}
        <YouTube videos={youtubeVideos} />
        {countriesVisited && <Map countriesVisited={countriesVisited} />}
      </div>
    </>
  );
}
