import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import exifr from "exifr";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "../../interfaces/photo-gallery";
import { Button } from "@prasheel/ui";

interface ExifData {
    camera?: string;
    lens?: string;
    iso?: number;
    aperture?: number;
    shutter?: string;
    focalLength?: number;
    date?: string;
}

const formatShutter = (s?: number) => {
    if (!s) return undefined;
    if (s >= 1) return `${s}s`;
    return `1/${Math.round(1 / s)}s`;
};

const formatDate = (d?: Date) => {
    if (!d) return undefined;
    try {
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
        return undefined;
    }
};

interface PhotoGalleryProps {
    galleryItems: GalleryImage[];
}

export default function PhotoGallery({ galleryItems }: PhotoGalleryProps) {
    const [activeFilter, setActiveFilter] = useState("all");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [exif, setExif] = useState<ExifData | null>(null);
    const [exifLoading, setExifLoading] = useState(false);
    const [tilesLoaded, setTilesLoaded] = useState<Record<string, boolean>>({});
    const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const thumbStripRef = useRef<HTMLDivElement | null>(null);
    const activeThumbRef = useRef<HTMLButtonElement | null>(null);

    const filteredImages = useMemo(
        () => (activeFilter === "all" ? galleryItems : galleryItems.filter((i) => i.category === activeFilter)),
        [activeFilter, galleryItems],
    );

    const categories = useMemo(
        () => ["all", ...Array.from(new Set(galleryItems.map((i) => i.category)))],
        [galleryItems],
    );

    const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);

    const showPrev = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + filteredImages.length) % filteredImages.length));
    }, [filteredImages.length]);

    const showNext = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % filteredImages.length));
    }, [filteredImages.length]);

    useEffect(() => {
        setLightboxIndex(null);
    }, [activeFilter]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            else if (e.key === "ArrowLeft") showPrev();
            else if (e.key === "ArrowRight") showNext();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [lightboxIndex, closeLightbox, showPrev, showNext]);

    useEffect(() => {
        if (lightboxIndex === null || filteredImages.length < 2) return;
        const neighbours = [
            filteredImages[(lightboxIndex + 1) % filteredImages.length],
            filteredImages[(lightboxIndex - 1 + filteredImages.length) % filteredImages.length],
        ];
        neighbours.forEach((img) => {
            if (!img) return;
            const preload = new window.Image();
            preload.src = img.src;
        });
    }, [lightboxIndex, filteredImages]);

    useEffect(() => {
        if (lightboxIndex === null) {
            setExif(null);
            return;
        }
        const img = filteredImages[lightboxIndex];
        if (!img) return;
        let cancelled = false;
        setExif(null);
        setExifLoading(true);
        exifr
            .parse(img.src)
            .then((data) => {
                if (cancelled) return;
                if (!data) {
                    setExif(null);
                    return;
                }
                const camera = [data.Make, data.Model].filter(Boolean).join(" ").trim() || undefined;
                setExif({
                    camera,
                    lens: data.LensModel || data.Lens || undefined,
                    iso: data.ISO || data.ISOSpeedRatings,
                    aperture: data.FNumber || data.ApertureValue,
                    shutter: formatShutter(data.ExposureTime),
                    focalLength: data.FocalLength,
                    date: formatDate(data.DateTimeOriginal || data.CreateDate || data.ModifyDate),
                });
            })
            .catch(() => {
                if (!cancelled) setExif(null);
            })
            .finally(() => {
                if (!cancelled) setExifLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [lightboxIndex, filteredImages]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        setLightboxImageLoaded(false);
        activeThumbRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, [lightboxIndex]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) {
            if (dx < 0) showNext();
            else showPrev();
        }
        touchStartX.current = null;
    };

    const current = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

    const renderTile = (image: GalleryImage, indexInFiltered: number) => {
        const loaded = tilesLoaded[image.id];
        return (
            <button
                key={image.id}
                type="button"
                onClick={() => openLightbox(indexInFiltered)}
                style={{ animationDelay: `${Math.min(indexInFiltered * 25, 600)}ms` }}
                className="group relative mb-4 block w-full animate-fade-in-up overflow-hidden rounded-base border-2 border-border bg-secondary-background break-inside-avoid text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={image.caption || image.location || image.category}
            >
                <div className="relative">
                    {!loaded && (
                        <div className="absolute inset-0 animate-pulse bg-secondary-background" />
                    )}
                    <Image
                        src={image.thumb}
                        alt={image.caption || image.location || image.category}
                        width={800}
                        height={1000}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onLoad={() => setTilesLoaded((prev) => (prev[image.id] ? prev : { ...prev, [image.id]: true }))}
                        className={`block h-auto w-full transition-all duration-500 ease-out group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
                {(image.caption || image.location) && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {image.caption && <p className="text-sm font-medium text-white">{image.caption}</p>}
                        {image.location && <p className="text-xs text-white/80">{image.location}</p>}
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-12 sm:px-6">
                <header className="mb-10 text-center">
                    <h1 className="mb-3 text-3xl font-bold text-foreground md:text-5xl">My Photo Book</h1>
                    <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                        A collection of moments and memories captured during my journeys around the world.
                    </p>
                </header>

                <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={activeFilter === cat ? "default" : "neutral"}
                            size="sm"
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat === "all" ? "All" : cat}
                        </Button>
                    ))}
                </div>

                {filteredImages.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No photos found for this category. More coming soon!
                    </p>
                ) : (
                    <div key={activeFilter} className="gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                        {filteredImages.map((image, i) => renderTile(image, i))}
                    </div>
                )}
            </main>

            {current && lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                    onClick={closeLightbox}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="pointer-events-auto max-w-[60%] rounded-base bg-black/50 px-3 py-2 text-xs text-white backdrop-blur sm:text-sm">
                            {exifLoading && !exif && <span className="text-white/60">Reading EXIF…</span>}
                            {!exifLoading && !exif && <span className="text-white/50">No EXIF data</span>}
                            {exif && (
                                <div className="space-y-0.5">
                                    {exif.camera && <div className="font-semibold">{exif.camera}</div>}
                                    {exif.lens && <div className="text-white/80">{exif.lens}</div>}
                                    {(exif.focalLength || exif.aperture || exif.shutter || exif.iso) && (
                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-white/90">
                                            {exif.focalLength && <span>{Math.round(exif.focalLength)}mm</span>}
                                            {exif.aperture && <span>f/{exif.aperture}</span>}
                                            {exif.shutter && <span>{exif.shutter}</span>}
                                            {exif.iso && <span>ISO {exif.iso}</span>}
                                        </div>
                                    )}
                                    {exif.date && <div className="text-white/60">{exif.date}</div>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="pointer-events-auto rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                                {lightboxIndex + 1} / {filteredImages.length}
                            </span>
                            <Button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                                variant="noShadow"
                                size="icon"
                                className="pointer-events-auto rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:ring-white"
                                aria-label="Close"
                            >
                                <X className="size-6" />
                            </Button>
                        </div>
                    </div>

                    {filteredImages.length > 1 && (
                        <>
                            <Button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                                variant="noShadow"
                                size="icon"
                                className="absolute left-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:ring-white sm:left-6"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="size-6" />
                            </Button>
                            <Button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); showNext(); }}
                                variant="noShadow"
                                size="icon"
                                className="absolute right-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:ring-white sm:right-6"
                                aria-label="Next image"
                            >
                                <ChevronRight className="size-6" />
                            </Button>
                        </>
                    )}

                    <div
                        className="relative flex h-full w-full items-center justify-center px-4 pb-40 pt-24 sm:px-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!lightboxImageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                <div className="size-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                            </div>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={current.id}
                            src={current.src}
                            alt={current.caption || current.location || current.category}
                            onLoad={() => setLightboxImageLoaded(true)}
                            className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${lightboxImageLoaded ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
                        />
                    </div>

                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-stretch gap-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10 sm:px-6 sm:pb-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(current.caption || current.location) && (
                            <div className="pointer-events-none flex flex-col items-center gap-0.5 text-center">
                                {current.caption && <p className="text-base font-medium text-white sm:text-lg">{current.caption}</p>}
                                {current.location && <p className="text-xs text-white/70 sm:text-sm">{current.location}</p>}
                            </div>
                        )}
                        {filteredImages.length > 1 && (
                            <div
                                ref={thumbStripRef}
                                className="pointer-events-auto flex gap-2 overflow-x-auto px-1 pb-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {filteredImages.map((img, i) => {
                                    const isActive = i === lightboxIndex;
                                    return (
                                        <button
                                            key={img.id}
                                            ref={isActive ? activeThumbRef : undefined}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                                            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded transition-all duration-200 ${isActive ? "ring-2 ring-white opacity-100 scale-105" : "opacity-50 hover:opacity-90"}`}
                                            aria-label={`View image ${i + 1}`}
                                            aria-current={isActive}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={img.thumb}
                                                alt=""
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
