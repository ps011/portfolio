import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script';

interface MetaProps {
    title: string;
    desc: string;
    name: string;
    css?: string[];
    js?: string[];
    image?: string;
    url?: string;
    twitterHandle?: string;
    manifest?: string;
    keywords?: string[];
    themeColor?: string;

}
const Meta = ({
  title, desc, url, image, css, js, name, twitterHandle, manifest, keywords, themeColor,
}: MetaProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={desc} />
    <meta name="author" content="Prasheel Soni" />
    <meta name="keywords" content={keywords.toString()} />
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
    <Script src="/js/bootstrap.bundle.min.js" />

    {
            css.length
            && css.map((c) => <Link rel="stylesheet" href={`${c}`} legacyBehavior />)
        }
    {
            js.length
            && js.map((j) => <script type="text/javascript" src={`${j}`} />)
        }
  </Head>
)
export default Meta
