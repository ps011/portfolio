import Banner from "../sections/banner/banner";
import About from "../sections/about/about";
import Experience from "../sections/experience/experience";
import Interests from "../sections/interests/interests";
import BlogSection from "../sections/blog/blog";
import { Map } from "../sections/map/map";
import type { BlogCard } from "../interfaces/blog";
import type { UIConfig } from "../interfaces/ui-config";
import {
  getSiteData,
  getAboutData,
  getBlogs,
  getUIConfig,
} from "../lib/data";

export async function getStaticProps() {
  const [siteData, aboutData, blogs, uiConfig] = await Promise.all([
    getSiteData(),
    getAboutData(),
    getBlogs(),
    getUIConfig(),
  ]);

  if (!siteData) {
    console.error(
      "HomePage: Error fetching site data or siteData[0] is missing.",
    );
    return { notFound: true };
  }

  if (!aboutData) {
    console.error(
      "HomePage: Error fetching about data or aboutData[0] is missing.",
    );
    return { notFound: true };
  }

  return {
    props: {
      siteData,
      aboutData,
      bannerData: siteData.banner,
      blogs,
      uiConfig,
    },
    revalidate: 3600,
  };
}

interface IndexPageProps {
  bannerData: any;
  aboutData: any;
  blogs: BlogCard[];
  uiConfig: UIConfig;
}

export default function IndexPage({
  bannerData,
  aboutData,
  blogs,
}: IndexPageProps) {
  const interests = aboutData?.interests;
  const countriesVisited = aboutData?.countriesVisited;

  return (
    <>
      {bannerData && <Banner {...bannerData} />}
      <div className="mt-12">
        {aboutData && <About {...aboutData} />}
      {aboutData?.experience?.length > 0 && (
        <Experience experience={aboutData.experience} />
      )}
      {interests && <Interests interests={interests} illustration={"/images/illustrations/interests.svg"} profiles={aboutData?.profiles} />}
      {blogs && <BlogSection blogs={blogs} />}
      {countriesVisited && <Map countriesVisited={countriesVisited} />}
      </div>
    </>
  );
}
