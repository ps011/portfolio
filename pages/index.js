import PropTypes from 'prop-types'
import Banner from '../sections/banner/banner'
import Header from '../components/header/header'
import Meta from '../components/meta/meta'
import About from '../sections/about/about'
import Interests from '../sections/interests/interests'
import Blog from '../sections/blog/blog'
import Footer from '../sections/footer/footer'
import Github from '../components/github/github'

export async function getStaticProps() {
  const siteData = await fetch(`${process.env.BASE_URL}/site-data/${process.env.USER_ID}`)
  const data = await siteData.json()

  const about = await fetch(`${process.env.BASE_URL}/about/id/${process.env.USER_ID}`)
  const aboutData = await about.json()

  const blogs = await fetch(`${process.env.BASE_URL}/blogs`)
  const blogsData = await blogs.json();

  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: { ...data, about: aboutData, blogs: blogsData },
  }
}

export default function Home({
  meta, header, banner, about, blogs,
}) {
  return (
    <div>
      <Meta {...meta} />
      <Header {...header} />
      <Banner {...banner} />
      <About {...about} />
      <Interests interests={about.interests} />
      <Github username="ps011" />
      <Blog blogs={blogs} />
      <Footer />
      <main />
    </div>
  )
}

Home.propTypes = {
  meta: PropTypes.object,
  header: PropTypes.object,
  banner: PropTypes.object,
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

// TODO: Make about and banner attributes to be fetched from server/service
