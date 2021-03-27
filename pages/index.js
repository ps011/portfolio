import PropTypes from 'prop-types'
import Banner from '../components/banner/banner'
import Header from '../components/header/header'
import Meta from '../components/meta/meta'

export async function getStaticProps() {
  const res = await fetch(`${process.env.BASE_URL}/site-data/${process.env.USER_ID}`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: data,
  }
}

export default function Home({ meta, header, banner }) {
  return (
    <div>
      <Meta {...meta} />
      <Header {...header} />
      <Banner {...banner} />
      <main />
    </div>
  )
}

Home.propTypes = {
  meta: PropTypes.object,
  header: PropTypes.object,
  banner: PropTypes.object
}

Home.defaultProps = {
  meta: {},
  header: {},
  banner: {},
}

// TODO: Make about and banner attributes to be fetched from server/service
