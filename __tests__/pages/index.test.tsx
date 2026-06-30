import { render, screen } from "@testing-library/react";
import IndexPage, { getStaticProps } from "../../pages/index";
import { BlogCard } from "../../interfaces/blog";
import type { YouTubeVideo } from "../../interfaces/youtube";
import { getAboutData, getBlogs, getSiteData } from "../../lib/data";
import { getYouTubeVideos } from "../../lib/youtube";

jest.mock("../../sections/banner/banner", () => ({
  __esModule: true,
  default: () => <section data-testid="banner" />,
}));

jest.mock("../../sections/about/about", () => ({
  __esModule: true,
  default: () => <section data-testid="about" />,
}));

jest.mock("../../sections/experience/experience", () => ({
  __esModule: true,
  default: () => <section data-testid="experience" />,
}));

jest.mock("../../sections/blog/blog", () => ({
  __esModule: true,
  default: () => <section data-testid="blog" />,
}));

jest.mock("../../sections/youtube/youtube", () => ({
  __esModule: true,
  default: () => <section data-testid="youtube" />,
}));

jest.mock("../../sections/map/map", () => ({
  Map: () => <section data-testid="map" />,
}));

jest.mock("../../lib/data", () => ({
  getSiteData: jest.fn(),
  getAboutData: jest.fn(),
  getBlogs: jest.fn(),
}));

jest.mock("../../lib/youtube", () => ({
  getYouTubeVideos: jest.fn(),
}));

const mockBannerData = { headline: "Hello World" };

const mockAboutData = {
  experience: [{ title: "Software Engineer", company: "Acme" }],
  interests: [{ title: "Coding", description: "I code" }],
  countriesVisited: ["US", "CA"],
};

const mockBlogs: BlogCard[] = [
  {
    title: "My First Post",
    shortDescription: "A short description",
    thumbnail: "/thumb.jpg",
    tags: "react,typescript",
    link: "/blog/my-first-post",
    hidden: false,
    date: "2024-01-01",
    type: "blog",
  },
];

const mockYouTubeVideos: YouTubeVideo[] = [
  {
    id: "ndefUGEmywM",
    title: "VIVID VILNIUS EPISODE 02",
    url: "https://www.youtube.com/watch?v=ndefUGEmywM",
    thumbnailUrl: "https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg",
    publishedAt: "2026-04-27T15:24:04+00:00",
  },
];

describe("IndexPage", () => {
  beforeEach(() => {
    jest.mocked(getSiteData).mockResolvedValue({
      banner: mockBannerData,
    } as any);
    jest.mocked(getAboutData).mockResolvedValue(mockAboutData as any);
    jest.mocked(getBlogs).mockResolvedValue(mockBlogs);
    jest.mocked(getYouTubeVideos).mockResolvedValue(mockYouTubeVideos);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all sections when full data is provided", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={mockAboutData}
        blogs={mockBlogs}
        youtubeVideos={mockYouTubeVideos}
      />,
    );
    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getByTestId("about")).toBeInTheDocument();
    expect(screen.getByTestId("experience")).toBeInTheDocument();
    expect(screen.getByTestId("blog")).toBeInTheDocument();
    expect(screen.getByTestId("youtube")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
  });

  it("does not render banner when bannerData is absent", () => {
    render(
      <IndexPage
        bannerData={null}
        aboutData={mockAboutData}
        blogs={mockBlogs}
        youtubeVideos={mockYouTubeVideos}
      />,
    );
    expect(screen.queryByTestId("banner")).not.toBeInTheDocument();
  });

  it("does not render experience when experience array is empty", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={{ ...mockAboutData, experience: [] }}
        blogs={mockBlogs}
        youtubeVideos={mockYouTubeVideos}
      />,
    );
    expect(screen.queryByTestId("experience")).not.toBeInTheDocument();
  });

  it("does not render map when countriesVisited is absent", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={{ ...mockAboutData, countriesVisited: undefined }}
        blogs={mockBlogs}
        youtubeVideos={mockYouTubeVideos}
      />,
    );
    expect(screen.queryByTestId("map")).not.toBeInTheDocument();
  });

  it("renders blog section when blogs array is provided", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={mockAboutData}
        blogs={mockBlogs}
        youtubeVideos={mockYouTubeVideos}
      />,
    );
    expect(screen.getByTestId("blog")).toBeInTheDocument();
  });

  it("loads YouTube videos in static props", async () => {
    const result = await getStaticProps({ locale: "en" } as any);

    expect(getYouTubeVideos).toHaveBeenCalledWith(6);
    expect(result).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          youtubeVideos: mockYouTubeVideos,
        }),
        revalidate: 3600,
      }),
    );
  });
});
