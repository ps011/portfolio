import Gallery from "../../components/instagram/gallery";
import Head from "next/head";
import { useUIConfig } from "../../lib/ui-context";
import {
  getSiteData,
  getAboutData,
  getGalleryItems,
  getUIConfig,
} from "../../lib/data";

export async function getStaticProps() {
  const [siteData, aboutData, galleryItems, uiConfig] = await Promise.all([
    getSiteData(),
    getAboutData(),
    getGalleryItems(),
    getUIConfig(),
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
      uiConfig,
    },
    revalidate: 3600,
  };
}

interface PhotoGalleryPageProps {
  galleryItems: any[];
  uiConfig: any;
}

const PhotoGalleryPage = ({ galleryItems }: PhotoGalleryPageProps) => {
  const ui = useUIConfig();

  return (
    <>
      <Head>
        <title>{ui.gallery.pageTitle}</title>
      </Head>
      <Gallery galleryItems={galleryItems} />
    </>
  );
};

export default PhotoGalleryPage;
