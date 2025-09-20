import Banner from "../sections/banner/banner";
import About from "../sections/about/about";
import Interests from "../sections/interests/interests";
import BlogSection from "../sections/blog/blog"; 
import { Map } from "../sections/map/map";
import { Blog as tBlog } from "../interfaces/blog";

export async function getStaticProps() {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  const blogsRes = await fetch(`${process.env.BASE_URL}/blogs`);
  const allBlogsData: tBlog[] = await blogsRes.json();
  // Only pass first 6 blogs to reduce homepage data size
  const blogsData = allBlogsData.slice(0, 6);

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("HomePage: Error fetching site data or siteData[0] is missing.");
    return { notFound: true };
  }
  const site = siteDataArray[0]; // This object contains .meta, .header, .banner

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("HomePage: Error fetching about data or aboutData[0] is missing.");
    return { notFound: true };
  }
  const about = aboutDataArray[0]; // This object contains .profiles, .interests etc.

  return {
    props: {
      // Props for _app.tsx and Layout.tsx
      siteData: site,    // Passed as 'data' to Layout (contains meta, header)
      aboutData: about,  // Passed as 'about' to Layout (contains profiles)
      
      // Props for the IndexPage component itself
      bannerData: site.banner, 
      pageSpecificAboutData: about, // Renaming to avoid confusion if 'aboutData' is also a direct prop
      blogs: blogsData,
    },
    revalidate: 3600, // Revalidate once per hour
  };
}

interface IndexPageProps {
  // siteData and aboutData are primarily for _app/Layout, not directly destructured here unless needed
  bannerData: any;
  pageSpecificAboutData: any; 
  blogs: tBlog[];
}

export default function IndexPage({
  bannerData,
  pageSpecificAboutData,
  blogs,
}: IndexPageProps) {
  const interests = pageSpecificAboutData?.interests;
  const countriesVisited = pageSpecificAboutData?.countriesVisited;

  return (
    <>
      {bannerData && <Banner {...bannerData} />}
      {pageSpecificAboutData && <About {...pageSpecificAboutData} />}
      {interests && <Interests interests={interests} illustration={"/images/illustrations/interests.svg"} />}
      {blogs && <BlogSection blogs={blogs} />}
      {countriesVisited && <Map countriesVisited={countriesVisited} />}
    </>
  );
}
