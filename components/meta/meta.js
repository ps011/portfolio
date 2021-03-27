import PropTypes from 'prop-types'
import Head from 'next/head'
import Link from 'next/link'

const Meta = ({
  title, desc, url, image, css, js, name, twitterHandle, manifest, keywords, themeColor,
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={desc} />
    <meta name="author" content="Prasheel Soni" />
    <meta name="keywords" content={keywords} />
    <meta property="og:type" content="website" />
    <meta name="og:title" property="og:title" content={title} />
    <meta name="og:description" property="og:description" content={desc} />
    <meta property="og:author" content="Prasheel Soni" />
    <meta property="og:image:alt" content={`${name} Banner`} />
    <meta property="og:image" content={`${image}`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content={name} />
    <meta property="og:url" content={`${url}`} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={desc} />
    <meta name="twitter:site" content={twitterHandle} />
    <meta name="twitter:creator" content="@soniprasheel" />
    <meta name="twitter:domain" content={url} />
    <meta name="twitter:image" content={`${image}`} />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="theme-color" content={themeColor} />
    <meta itemProp="image" content={image} />
    <link rel="icon" type="image/png" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon.ico" />
    <link rel="canonical" href={`${url}`} />
    <link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon" />
    <link rel="manifest" href={manifest} />
    <script src="/js/bootstrap.bundle.min.js" />
    {
            css.length
            && css.map((c) => <Link rel="stylesheet" href={`${c}`} />)
        }
    {
            js.length
            && js.map((j) => <script type="text/javascript" src={`${j}`} />)
        }
  </Head>
)

Meta.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  css: PropTypes.arrayOf(PropTypes.string),
  js: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  url: PropTypes.string,
  twitterHandle: PropTypes.string,
  manifest: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  themeColor: PropTypes.string,
}

Meta.defaultProps = {
  css: [],
  js: [],
  image: 'https://res.cloudinary.com/designu/image/upload/v1601199790/images/about/profile-image-3.jpg',
  url: 'https://ps011.github.io',
  twitterHandle: '@soniprasheel',
  manifest: undefined,
  keywords: ['Prasheel Soni', 'web developer', 'freelancer', 'full stack developer', 'full stack web developer', 'web developer', 'React', 'ReactJS', 'Redux', 'AngularJS', 'Angular', 'Stencil', 'Ionic', 'Javascript', 'Node.JS'],
  // TODO: Change default theme color
  themeColor: '#ffffff',
}
export default Meta
