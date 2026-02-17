import Banner from "../sections/banner/banner";
import About from "../sections/about/about";
import Experience from "../sections/experience/experience";
import Interests from "../sections/interests/interests";
import BlogSection from "../sections/blog/blog";
import { Map } from "../sections/map/map";
import { Blog as tBlog, BlogCard } from "../interfaces/blog";

function toBlogCard(blog: tBlog): BlogCard {
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

export async function getStaticProps() {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  const blogsRes = await fetch(`${process.env.BASE_URL}/blogs`);
  const blogsData: tBlog[] = await blogsRes.json();

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("HomePage: Error fetching site data or siteData[0] is missing.");
    return { notFound: true };
  }
  const site = siteDataArray[0];

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("HomePage: Error fetching about data or aboutData[0] is missing.");
    return { notFound: true };
  }
  const about = aboutDataArray[0];

  return {
    props: {
      siteData: site,
      aboutData: about,
      bannerData: site.banner,
      blogs: blogsData.map(toBlogCard),
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
