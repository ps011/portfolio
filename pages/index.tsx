import Banner from "../sections/banner/banner";
import Header from "../components/header/header";
import Meta from "../components/meta/meta";
import About from "../sections/about/about";
import Interests from "../sections/interests/interests";
import Blog from "../sections/blog/blog";
import Footer from "../sections/footer/footer";
import GithubCalendar from "../components/github/githubCalendar";
import {Map} from "../sections/map/map";

import { Blog as tBlog } from "../interfaces/blog";


export async function getStaticProps() {
  const siteData = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const data = await siteData.json();

  const about = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutData = await about.json();

  const blogs = await fetch(`${process.env.BASE_URL}/blogs`);
  const blogsData: tBlog[] = await blogs.json();
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: { data: data[0], about: aboutData[0], blogs: blogsData },
    revalidate: 30 * 60 * 1000,
  };
}

interface HomeProps {
    data: any;
    about: any;
    blogs: tBlog[];
}

export default function Home({
  data, about, blogs,
}: HomeProps) {
  const { meta, banner, header } = data;
  const github = about.profiles.find((profile) => profile.name === "github");
  return (
    <div>
      <Meta {...meta} />
      <Header {...header} />
      <Banner {...banner} />
      <About {...about} />
      <Interests interests={about.interests} illustration={"/images/illustrations/interests.svg"} />
      <GithubCalendar username={github.username} />
      <Blog blogs={blogs} />
      <Map countriesVisited={about.countriesVisited}/>
      <Footer profiles={about.profiles}/>
      <main />
    </div>
  );
}
