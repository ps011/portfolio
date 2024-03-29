import PropTypes from 'prop-types'
import Banner from '../sections/banner/banner'
import Header from '../components/header/header'
import Meta from '../components/meta/meta'
import About from '../sections/about/about'
import Interests from '../sections/interests/interests'
import Blog from '../sections/blog/blog'
import Footer from '../sections/footer/footer'
import Github from '../components/github/github'
import Stackoverflow from '../components/stackoverflow/stackoverflow'
import {Map} from "../components/map/map";

import { Blog as tBlog } from '../interfaces/blog';


export async function getStaticProps() {
  const siteData = await fetch(`${process.env.BASE_URL}/site-datas/`)
  const data = await siteData.json()

  const about = await fetch(`${process.env.BASE_URL}/abouts/`)
  const aboutData = await about.json()

  const blogs = await fetch(`${process.env.BASE_URL}/blogs`)
  const blogsData: tBlog[] = await blogs.json();
  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: { data: data[0], about: aboutData[0], blogs: blogsData },
    revalidate: 30 * 60 * 1000,
  }
}

export default function Home({
  data, about, blogs,
}) {
  const { meta, banner, header } = data
  const stackoverflow = about.profiles.find((profile) => profile.name === 'stackoverflow')
  const github = about.profiles.find((profile) => profile.name === 'github')
  return (
    <div className="theme-dark">
      <Meta {...meta} />
      <Header {...header} />
      <Banner {...banner} />
      <About {...about} />
      <Interests interests={about.interests} />
      <Github username={github.username} />
      <Stackoverflow
        url={stackoverflow.url}
        id={stackoverflow.id}
        name={stackoverflow.username}
      />
      <Blog blogs={blogs} />
      <Map countriesVisited={about.countriesVisited}/>
      <Footer />
      <main />
    </div>
  )
}

Home.propTypes = {
  data: PropTypes.object,
  about: PropTypes.object,
  blogs: PropTypes.arrayOf(PropTypes.object),
}

Home.defaultProps = {
  meta: {},
  header: {},
  banner: {},
  about: {},
  blogs: [],
}
