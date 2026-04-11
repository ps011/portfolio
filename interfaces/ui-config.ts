export interface UIConfig {
  banner: { greeting: string };
  footer: {
    heading: string;
    subheading: string;
    ownerName: string;
    ownerUrl: string;
    licenseLabel: string;
    licenseUrl: string;
  };
  interests: {
    blogCta: string;
    photoCta: string;
    githubCta: string;
    githubUrl: string;
    comingSoon: string;
  };
  map: {
    heading: string;
    geoUrl: string;
  };
  header: { menuLabel: string };
  card: { readMoreLabel: string };
  gallery: {
    heading: string;
    description: string;
    allFilterLabel: string;
    emptyStateMessage: string;
    prevLabel: string;
    nextLabel: string;
    imagePreviewFallback: string;
    pageTitle: string;
  };
  blog: {
    shareLabel: string;
    loadingLabel: string;
  };
  markdownRenderer: {
    loadingLabel: string;
    errorLabel: string;
  };
}
