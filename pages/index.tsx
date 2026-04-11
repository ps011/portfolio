import Banner from "../sections/banner/banner";
import About from "../sections/about/about";
import Experience from "../sections/experience/experience";
import Interests from "../sections/interests/interests";
import BlogSection from "../sections/blog/blog";
import { Map } from "../sections/map/map";
import type { BlogCard } from "../interfaces/blog";
import { getSiteData, getAboutData, getBlogs } from "../lib/data";

export async function getStaticProps(context) {
  const [siteData, aboutData, blogs] = await Promise.all([
    getSiteData(),
    getAboutData(),
    getBlogs(),
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
      messages: (await import(`../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
}

interface IndexPageProps {
  bannerData: any;
  aboutData: any;
  blogs: BlogCard[];
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
      {interests && <Interests interests={interests} illustration={"/images/illustrations/interests.svg"} />}
      {blogs && <BlogSection blogs={blogs} />}
      {countriesVisited && <Map countriesVisited={countriesVisited} />}
      </div>
    </>
  );
}
