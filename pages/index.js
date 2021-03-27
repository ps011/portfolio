import PropTypes from 'prop-types'
import Banner from '../sections/banner/banner'
import Header from '../components/header/header'
import Meta from '../components/meta/meta'
import About from '../sections/about/about'
import Interests from '../sections/interests/interests'

export async function getStaticProps() {
  const siteData = await fetch(`${process.env.BASE_URL}/site-data/${process.env.USER_ID}`)
  const data = await siteData.json()

  const about = await fetch(`${process.env.BASE_URL}/about/id/${process.env.USER_ID}`)
  const aboutData = await about.json()
  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: { ...data, about: aboutData },
  }
}

export default function Home({
  meta, header, banner, about,
}) {
  return (
    <div>
      <Meta {...meta} />
      <Header {...header} />
      <Banner {...banner} />
      <About {...about} />
      <Interests interests={about.interests} />
      <main />
    </div>
  )
}

Home.propTypes = {
  meta: PropTypes.object,
  header: PropTypes.object,
  banner: PropTypes.object,
  about: PropTypes.object,
}

Home.defaultProps = {
  meta: {},
  header: {},
  banner: {},
  about: {},
}

// TODO: Make about and banner attributes to be fetched from server/service
