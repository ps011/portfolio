import Gallery from "../../components/instagram/gallery";

export async function getStaticProps() {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  // Fetch photo galleries and flatten images
  const photoGalleriesRes = await fetch(`${process.env.BASE_URL}/photo-galleries/`);
  const photoGalleries = await photoGalleriesRes.json();
  const galleryItems = photoGalleries.flatMap((gallery) =>
    (gallery.images || []).map((img, idx) => ({
      id: `${gallery.title}-${idx}`,
      src: img.src,
      thumb: img.src,
      caption: img.caption,
      category: gallery.title,
      location: gallery.location,
    }))
  );

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("PhotoGalleryPage: Error fetching site data.");
    return { notFound: true };
  }
  const site = siteDataArray[0];

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("PhotoGalleryPage: Error fetching about data.");
    return { notFound: true };
  }
  const about = aboutDataArray[0];

  return {
    props: {
      siteData: site,
      aboutData: about,
      galleryItems,
    },
    revalidate: 3600,
  };
}

interface PhotoGalleryPageProps {
  galleryItems: any[];
}

const PhotoGalleryPage = ({ galleryItems }: PhotoGalleryPageProps) => {
  return (
    <Gallery galleryItems={galleryItems} />
  );
};

export default PhotoGalleryPage;
