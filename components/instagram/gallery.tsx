import React, { useState, useEffect, useCallback } from "react";

// Sample data for gallery images - replace with your actual data source
const initialGalleryImages = [
    { id: "1", src: "https://placehold.co/800x600/A98C55/FFFFFF?text=Ladakh+Panorama", thumb: "https://placehold.co/400x300/A98C55/FFFFFF?text=Ladakh+1", category: "ladakh", caption: "Expansive panorama of the Ladakh mountain range." },
    { id: "2", src: "https://placehold.co/800x600/E2C480/343A40?text=Monastery+View", thumb: "https://placehold.co/400x300/E2C480/343A40?text=Ladakh+2", category: "ladakh", caption: "A serene monastery nestled in the hills of Ladakh." },
    { id: "3", src: "https://placehold.co/800x600/D3AF61/FFFFFF?text=Udaipur+Lake+Palace", thumb: "https://placehold.co/400x300/D3AF61/FFFFFF?text=Udaipur+1", category: "udaipur", caption: "The majestic Lake Palace in Udaipur at sunset." },
    { id: "4", src: "https://placehold.co/800x600/F3DDA6/343A40?text=City+Palace+Udaipur", thumb: "https://placehold.co/400x300/F3DDA6/343A40?text=Udaipur+2", category: "udaipur", caption: "Intricate architecture of the City Palace, Udaipur." },
    { id: "5", src: "https://placehold.co/800x600/CFAZ71/FFFFFF?text=Mountain+Trail", thumb: "https://placehold.co/400x300/CFAZ71/FFFFFF?text=Mountains+1", category: "mountains", caption: "A winding trail through towering peaks." },
    { id: "6", src: "https://placehold.co/800x600/BC9B63/FFFFFF?text=Snowy+Summit", thumb: "https://placehold.co/400x300/BC9B63/FFFFFF?text=Mountains+2", category: "mountains", caption: "View from a snow-capped mountain summit." },
    { id: "7", src: "https://placehold.co/800x600/967D47/FFFFFF?text=Urban+Skyline", thumb: "https://placehold.co/400x300/967D47/FFFFFF?text=Cityscape+1", category: "cityscapes", caption: "Dazzling urban skyline at twilight." },
    { id: "8", src: "https://placehold.co/800x600/A98C55/FFFFFF?text=Historic+Street", thumb: "https://placehold.co/400x300/A98C55/FFFFFF?text=Cityscape+2", category: "cityscapes", caption: "A charming historic street in an old city." },
    { id: "9", src: "https://placehold.co/800x600/E2C480/343A40?text=Manalsheer+Ganga+Trek", thumb: "https://placehold.co/400x300/E2C480/343A40?text=Manalsheer", category: "mountains", caption: "Scenic views from the Manalsheer Ganga trek." },
    { id: "10", src: "https://placehold.co/800x600/D3AF61/FFFFFF?text=Desert+Oasis", thumb: "https://placehold.co/400x300/D3AF61/FFFFFF?text=Ladakh+3", category: "ladakh", caption: "An unexpected oasis in the high-altitude desert of Ladakh." },
    { id: "11", src: "https://placehold.co/800x600/F3DDA6/343A40?text=Udaipur+Market", thumb: "https://placehold.co/400x300/F3DDA6/343A40?text=Udaipur+3", category: "udaipur", caption: "Vibrant colors of a local market in Udaipur." },
    { id: "12", src: "https://placehold.co/800x600/CFAZ71/FFFFFF?text=Alpine+Lake", thumb: "https://placehold.co/400x300/CFAZ71/FFFFFF?text=Mountains+3", category: "mountains", caption: "Crystal clear waters of an alpine lake." },
];

// Define available filters - you can generate this dynamically if needed
const filterCategories = [
    { key: "all", label: "All" },
    { key: "ladakh", label: "Ladakh" },
    { key: "udaipur", label: "Udaipur" },
    { key: "mountains", label: "Mountains" },
    { key: "cityscapes", label: "Cityscapes" },
];

// Close Icon SVG for the modal
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);


export default function PhotoGallery() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredImages, setFilteredImages] = useState(initialGalleryImages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalImageDetails, setModalImageDetails] = useState({ src: "", caption: "" });

    // Effect to update filtered images when activeFilter changes
    useEffect(() => {
        if (activeFilter === "all") {
            setFilteredImages(initialGalleryImages);
        } else {
            setFilteredImages(initialGalleryImages.filter(image => image.category === activeFilter));
        }
    }, [activeFilter]);

    // Function to open the modal
    const openModal = useCallback((index) => {
        setCurrentImageIndex(index);
        setModalImageDetails({
            src: filteredImages[index].src,
            caption: filteredImages[index].caption,
        });
        setIsModalOpen(true);
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


    // Styles (can be moved to a separate CSS module or kept here for simplicity)
    // Note: Tailwind classes are used directly in JSX. These are for custom styles if needed.
    // The CSS from the HTML version is largely replicated by Tailwind classes below.
    // .btn-filter, .btn-filter.active, etc. are handled by dynamic classNames.

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#343A40] font-['Inter']">
            <main className="container mx-auto px-6 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#343A40] mb-4">My Travel Photography</h1>
                    <p className="text-lg text-[#6C757D] max-w-2xl mx-auto">
                        A collection of moments and memories captured during my journeys around the world.
                    </p>
                </header>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
                    {filterCategories.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors duration-150
                                ${activeFilter === filter.key
                                    ? "bg-[#E2C480] text-[#343A40] border border-[#E2C480]"
                                    : "bg-white text-[#343A40] border border-[#DEE2E6] hover:bg-[#E2C480] hover:border-[#E2C480]"
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
                                key={image.id || index} // Use a unique ID if available, otherwise index
                                className="group cursor-pointer overflow-hidden rounded-lg shadow-sm bg-white"
                                onClick={() => openModal(index)}
                            >
                                <img
                                    src={image.thumb}
                                    alt={image.caption}
                                    className="w-full h-60 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                                <div className="p-3">
                                    <p className="text-sm font-medium text-[#343A40] truncate" title={image.caption}>
                                        {image.caption}
                                    </p>
                                    <p className="text-xs text-[#6C757D] capitalize">{image.category}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-[#6C757D]">
                            No photos found for this category. More coming soon!
                        </p>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 w-full h-full flex items-center justify-center z-[100] bg-black bg-opacity-80 transition-opacity duration-300 ease-in-out"
                    onClick={closeModal} // Close on overlay click
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                >
                    <div
                        className="mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 relative transform transition-all duration-300 ease-out max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
                    >
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <h3 id="modalTitle" className="text-xl font-semibold text-[#343A40] truncate max-w-[calc(100%-3rem)]">
                                {modalImageDetails.caption || "Image Preview"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="py-4 text-center">
                            <img
                                src={modalImageDetails.src}
                                alt={modalImageDetails.caption}
                                className="rounded-md mx-auto object-contain max-w-full max-h-[75vh]"
                            />
                            <p className="text-[#6C757D] text-sm mt-3">{modalImageDetails.caption}</p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <button
                                onClick={showPrevImage}
                                className="bg-[#E2C480] text-[#343A40] px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors text-sm font-medium"
                                aria-label="Previous image"
                            >
                                &larr; Previous
                            </button>
                            <button
                                onClick={showNextImage}
                                className="bg-[#E2C480] text-[#343A40] px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors text-sm font-medium"
                                aria-label="Next image"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer (Placeholder - integrate your actual Next.js Footer component here) */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-[#6C757D]">
                    <p>&copy; {new Date().getFullYear()} Prasheel. All Rights Reserved.</p>
                    <p className="text-xs mt-1">Designed with a passion for code and travel.</p>
                </div>
            </footer>
        </div>
    );
}
