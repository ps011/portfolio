import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "../../interfaces/photo-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

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
        <div className="bg-brandMutedYellow-100 dark:bg-brandMutedYellow-800 min-h-screen">
            <main className="container mx-auto px-6 py-12">
                <header className="mb-12 text-center">
                    <h1 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        My Photo Book
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        A collection of moments and memories captured during my journeys around the world.
                    </p>
                </header>

                {/* Filter Buttons */}
                <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4">
                    {dynamicCategories.map((filter) => (
                        <Button
                            key={filter.key}
                            variant={activeFilter === filter.key ? "default" : "neutral"}
                            size="sm"
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredImages.length > 0 ? (
                        filteredImages.map((image, index) => (
                            <Card
                                key={image.id || index}
                                className="group bg-main cursor-pointer overflow-hidden p-0 transition-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                onClick={() => openModal(index)}
                            >
                                <div className="relative overflow-hidden">
                                    {imageLoading[image.id] !== false && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                                            <div className="size-8 animate-spin rounded-full border-4 border-border border-t-transparent" />
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
                                </div>
                                <CardContent className="p-3 flex flex-row justify-between gap-2">
                                    <p className="text-sm font-medium text-white">{image.caption}</p>
                                    <Badge variant="neutral">{image.category}</Badge>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-neutralGray-700 dark:text-neutralGray-300">
                            No photos found for this category. More coming soon!
                        </p>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center bg-black/80 transition-opacity duration-300 ease-in-out"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                >
                    <div
                        className="flex max-h-[90vh] w-11/12 flex-col overflow-hidden rounded-base border-2 border-border bg-background p-4 shadow-shadow sm:p-6 md:w-3/4 lg:w-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex shrink-0 items-center justify-between border-b-2 border-border pb-3">
                            <h3 id="modalTitle" className="truncate text-xl font-heading font-semibold text-foreground" style={{ maxWidth: "calc(100% - 3rem)" }}>
                                {modalImageDetails.caption || "Image Preview"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="shrink-0 rounded-base border-2 border-border bg-main p-2 text-main-foreground transition-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                aria-label="Close modal"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="relative min-h-0 flex-1 overflow-y-auto py-4 text-center">
                            {modalImageLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                                    <div className="size-8 animate-spin rounded-full border-4 border-border border-t-transparent" />
                                </div>
                            )}
                            <Image
                                src={modalImageDetails.src}
                                alt={modalImageDetails.caption}
                                width={800}
                                height={600}
                                className="mx-auto max-h-[70vh] w-full rounded-base object-contain"
                                onLoad={() => setModalImageLoading(false)}
                                style={modalImageLoading ? { visibility: "hidden" } : {}}
                            />
                            <p className="mt-3 text-sm text-foreground">{modalImageDetails.caption}</p>
                            {filteredImages[currentImageIndex]?.location && (
                                <p className="mt-1 text-xs text-muted-foreground">{filteredImages[currentImageIndex].location}</p>
                            )}
                        </div>
                        <div className="flex shrink-0 items-center justify-between border-t-2 border-border pt-3">
                            <Button variant="default" size="sm" onClick={showPrevImage} aria-label="Previous image">
                                &larr; Previous
                            </Button>
                            <Button variant="default" size="sm" onClick={showNextImage} aria-label="Next image">
                                Next &rarr;
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
