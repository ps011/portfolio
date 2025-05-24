import About from "../../sections/about/about";
import Interests from "../../sections/interests/interests";
import Blog from "../../sections/blog/blog";
import GithubCalendar from "../../components/github/githubCalendar";
import {Map} from "../../sections/map/map";

import { Blog as tBlog } from "../../interfaces/blog";
import Banner from "../../sections/banner/banner";


export async function getStaticProps() {
  const siteData = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const data = await siteData.json();

  const about = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutData = await about.json();

  const blogs = await fetch(`${process.env.BASE_URL}/blogs`);
  const blogsData: tBlog[] = await blogs.json();
  
  return {
    props: { data, about: aboutData[0], blogs: blogsData },
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
  const github = about.profiles.find((profile) => profile.name === "github");
  const {banner} = data[0];
  
  return (
    <>
      <Banner {...banner} />
      <About {...about} />
      <Interests interests={about.interests} illustration={"/images/illustrations/interests.svg"} />
      <GithubCalendar username={github.username} />
      <Blog blogs={blogs} />
      <Map countriesVisited={about.countriesVisited}/>
    </>
  );
};
