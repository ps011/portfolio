import type { UIConfig } from "../interfaces/ui-config";

export const DEFAULT_UI_CONFIG: UIConfig = {
  banner: { greeting: "Hi, I'm" },
  footer: {
    heading: "Thank you for stopping by!",
    subheading: "Let's get in touch on any of these platforms.",
    ownerName: "Prasheel",
    ownerUrl: "https://linkedin.com/in/ps011",
    licenseLabel: "License",
    licenseUrl: "https://github.com/ps011/ps11/LICENSE.md",
  },
  interests: {
    blogCta: "View My Blog Posts",
    photoCta: "Explore Photo Gallery",
    githubCta: "View My GitHub",
    githubUrl: "https://github.com/ps011",
    comingSoon: "Coming Soon",
  },
  map: {
    heading: "How much of the World I've seen?",
    geoUrl: "https://res.cloudinary.com/designu/raw/upload/v1681593003/data/geo.json",
  },
  header: { menuLabel: "Menu" },
  card: { readMoreLabel: "Read more" },
  gallery: {
    heading: "My Photo Book",
    description: "A collection of moments and memories captured during my journeys around the world.",
    allFilterLabel: "All",
    emptyStateMessage: "No photos found for this category. More coming soon!",
    prevLabel: "\u2190 Previous",
    nextLabel: "Next \u2192",
    imagePreviewFallback: "Image Preview",
    pageTitle: "Photo Gallery | Prasheel Soni",
  },
  blog: {
    shareLabel: "Share this Post:",
    loadingLabel: "Loading blog post...",
  },
  markdownRenderer: {
    loadingLabel: "Loading...",
    errorLabel: "Failed to load content.",
  },
};
