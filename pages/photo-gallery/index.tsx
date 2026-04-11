import Gallery from "../../components/instagram/gallery";
import Head from "next/head";
import { getSiteData, getAboutData, getGalleryItems } from "../../lib/data";

export async function getStaticProps(context) {
  const [siteData, aboutData, galleryItems] = await Promise.all([
    getSiteData(),
    getAboutData(),
    getGalleryItems(),
  ]);

  if (!siteData) {
    console.error("PhotoGalleryPage: Error fetching site data.");
    return { notFound: true };
  }

  if (!aboutData) {
    console.error("PhotoGalleryPage: Error fetching about data.");
    return { notFound: true };
  }

  return {
    props: {
      siteData,
      aboutData,
      galleryItems,
      messages: (await import(`../../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
}

interface PhotoGalleryPageProps {
  galleryItems: any[];
}

const PhotoGalleryPage = ({ galleryItems }: PhotoGalleryPageProps) => {
  return (
    <>
      <Head>
        <title>Photo Gallery | Prasheel Soni</title>
      </Head>
      <Gallery galleryItems={galleryItems} />
    </>
  );
};

export default PhotoGalleryPage;
