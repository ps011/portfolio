import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "../../interfaces/photo-gallery";

interface PhotoGalleryProps {
    galleryItems: GalleryImage[];
}

// Close Icon SVG for the modal
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);

export default function PhotoGallery({ galleryItems }: PhotoGalleryProps) {
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalImageDetails, setModalImageDetails] = useState({ src: "", caption: "" });
    const [imageLoading, setImageLoading] = useState<{ [id: string]: boolean }>({});
    const [modalImageLoading, setModalImageLoading] = useState(false);

    // Update filtered images when activeFilter or galleryItems change
    useEffect(() => {
        if (activeFilter === "all") {
            setFilteredImages(galleryItems);
        } else {
            setFilteredImages(galleryItems.filter(image => image.category === activeFilter));
        }
    }, [activeFilter, galleryItems]);

    // Function to open the modal
    const openModal = useCallback((index) => {
        setCurrentImageIndex(index);
        setModalImageDetails({
            src: filteredImages[index].src,
            caption: filteredImages[index].caption,
        });
        setIsModalOpen(true);
        setModalImageLoading(true);
    }, [filteredImages]);

    // Function to close the modal
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Functions for modal navigation
    const showPrevImage = useCallback(() => {
        const newIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        openModal(newIndex);
    }, [currentImageIndex, filteredImages, openModal]);

    const showNextImage = useCallback(() => {
        const newIndex = (currentImageIndex + 1) % filteredImages.length;
        openModal(newIndex);
    }, [currentImageIndex, filteredImages, openModal]);

    // Effect for keyboard navigation in modal and body scroll lock
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isModalOpen) return;
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowLeft") showPrevImage();
            if (e.key === "ArrowRight") showNextImage();
        };

        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto"; // Ensure scroll is restored
        };
    }, [isModalOpen, closeModal, showPrevImage, showNextImage]);

    // Update filterCategories dynamically from galleryImages
    const dynamicCategories = [
        { key: "all", label: "All" },
        ...Array.from(new Set(galleryItems.map(img => img.category))).map(cat => ({ key: cat, label: cat })),
    ];

    // Handler for image load
    const handleImageLoad = (id: string) => {
        setImageLoading((prev) => ({ ...prev, [id]: false }));
    };

    return (
        <div className="bg-primary-100 dark:bg-primary-800 min-h-screen">
            <main className="container mx-auto px-6 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-tertiary-900 dark:text-white mb-4">My Photo Book</h1>
                    <p className="text-lg text-tertiary-700 dark:text-tertiary-300 max-w-2xl mx-auto">
                        A collection of moments and memories captured during my journeys around the world.
                    </p>
                </header>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
                    {dynamicCategories.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors duration-150
                                ${activeFilter === filter.key
                                    ? "bg-primary-500 text-tertiary-900 border border-primary-500 dark:bg-primary-700 dark:text-white"
                                    : "bg-white text-tertiary-900 border border-tertiary-300 hover:bg-primary-100 hover:border-primary-500 dark:bg-tertiary-800 dark:text-white dark:border-tertiary-700 dark:hover:bg-primary-800 dark:hover:border-primary-700"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredImages.length > 0 ? (
                        filteredImages.map((image, index) => (
                            <div
                                key={image.id || index}
                                className="group cursor-pointer overflow-hidden rounded-lg shadow-sm bg-white dark:bg-tertiary-800 relative"
                                onClick={() => openModal(index)}
                            >
                                {/* Loading spinner */}
                                {imageLoading[image.id] !== false && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-tertiary-800/60 z-10">
                                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <Image
                                    src={image.thumb}
                                    alt={image.caption}
                                    width={400}
                                    height={300}
                                    className="w-full h-60 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    onLoad={() => handleImageLoad(image.id)}
                                    style={imageLoading[image.id] !== false ? { visibility: "hidden" } : {}}
                                />
                                <div className="p-3">
                                    <p className="text-sm font-medium text-tertiary-900 dark:text-white truncate" title={image.caption}>
                                        {image.caption}
                                    </p>
                                    <p className="text-xs text-tertiary-700 dark:text-tertiary-300 capitalize">{image.category}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-tertiary-700 dark:text-tertiary-300">
                            No photos found for this category. More coming soon!
                        </p>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 w-full h-full flex items-center justify-center z-[100] bg-black bg-opacity-80 transition-opacity duration-300 ease-in-out"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                >
                    <div
                        className="mx-auto p-4 sm:p-6 bg-white dark:bg-tertiary-800 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 relative transform transition-all duration-300 ease-out max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center pb-3 border-b border-tertiary-200 dark:border-tertiary-700">
                            <h3 id="modalTitle" className="text-xl font-semibold text-tertiary-900 dark:text-white truncate max-w-[calc(100%-3rem)]">
                                {modalImageDetails.caption || "Image Preview"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-tertiary-400 hover:text-tertiary-600 dark:text-tertiary-500 dark:hover:text-tertiary-300 transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="py-4 text-center relative">
                            {modalImageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-tertiary-800/60 z-10">
                                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            <Image
                                src={modalImageDetails.src}
                                alt={modalImageDetails.caption}
                                width={800}
                                height={600}
                                className="rounded-md mx-auto object-contain max-w-full max-h-[75vh]"
                                onLoad={() => setModalImageLoading(false)}
                                style={modalImageLoading ? { visibility: "hidden" } : {}}
                            />
                            <p className="text-tertiary-700 dark:text-tertiary-300 text-sm mt-3">{modalImageDetails.caption}</p>
                            {filteredImages[currentImageIndex]?.location && (
                                <p className="text-xs text-tertiary-600 dark:text-tertiary-400 mt-1">{filteredImages[currentImageIndex].location}</p>
                            )}
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-tertiary-200 dark:border-tertiary-700">
                            <button
                                onClick={showPrevImage}
                                className="bg-primary-500 text-tertiary-900 dark:bg-primary-700 dark:text-white px-4 py-2 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-800 transition-colors text-sm font-medium"
                                aria-label="Previous image"
                            >
                                &larr; Previous
                            </button>
                            <button
                                onClick={showNextImage}
                                className="bg-primary-500 text-tertiary-900 dark:bg-primary-700 dark:text-white px-4 py-2 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-800 transition-colors text-sm font-medium"
                                aria-label="Next image"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
