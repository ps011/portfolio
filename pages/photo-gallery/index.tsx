import Gallery from "react-photo-gallery";
import { useCallback, useState } from "react";

export async function getStaticProps() {
    const photosData = await fetch(`${process.env.BASE_URL}/photo-galleries/`)
    const photos = await photosData.json()

    if (!photos) {
        return {
            notFound: true,
        }
    }
    return {
        props: { photos },
        revalidate: 30 * 60 * 1000,
    }
}

const PhotoGallery = ({ photos }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };
    return (
        <div>
            <Gallery photos={photos} onClick={openLightbox} />
        </div>
    );
}

export default PhotoGallery;