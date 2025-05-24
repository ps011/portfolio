"use client";
import Gallery from "../../components/instagram/gallery";
import Instagram from "../../components/instagram/instagram";

export async function getStaticProps() {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  // Placeholder for photo gallery items if fetched server-side
  const photoGalleryItems = []; 

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
      // Props for _app.tsx and Layout.tsx
      siteData: site,
      aboutData: about,
      // Props for the PhotoGalleryPage component itself
      galleryItems: photoGalleryItems, 
    },
    revalidate: 3600, 
  };
}

interface PhotoGalleryPageProps {
  galleryItems: any[]; 
  // siteData and aboutData are used by _app/Layout, not directly needed here
}

const PhotoGalleryPage = ({ galleryItems }: PhotoGalleryPageProps) => {
  // If Gallery component needs to be a client component for interactivity,
  // ensure "use client"; is at the top of the Gallery.tsx file itself.
  return (
    <Gallery />
  );
};

export default PhotoGalleryPage;
