import PropTypes from 'prop-types'
import Banner from '../components/banner/banner'
import Header from '../components/header/header'
import Meta from '../components/meta/meta'

export async function getStaticProps() {
  const res = await fetch('http://localhost:3001/site-data/5e7662160159fc3d220ea3e1')
  const data = await res.json()
  console.log(data)

  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: data, // will be passed to the page component as props
  }
}

export default function Home({ meta }) {
  console.log('====>', meta)
  return (
    <div>
      <Meta
        name={meta.name}
        title={meta.title}
        desc={meta.desc}
      />
      <Header logoUrl="/images/logos/logo.png" />
      <Banner />
      <main />
    </div>
  )
}

Home.propTypes = {
  meta: {
    name: PropTypes.string.isRequired,
  },
}

Home.defaultProps = {
  meta: {},
}

// TODO: Make meta and header attributes to be fetched from server/service
