export interface UIConfig {
  banner: { greeting: string };
  about: {
    heading: string;
    skillsHeading: string;
    clickToReadMore: string;
    moreSkillsSuffix: string;
  };
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
    visitedColor: string;
    unvisitedColor: string;
    hoverVisitedColor: string;
    hoverUnvisitedColor: string;
    borderColor: string;
    projectionCenter: [number, number];
    projectionScale: number;
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
  blog: { shareLabel: string; loadingLabel: string };
  meta: { author: string; twitterCreator: string };
  markdownRenderer: { loadingLabel: string; errorLabel: string };
}
