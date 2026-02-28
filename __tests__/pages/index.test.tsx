import { render, screen } from "@testing-library/react";
import IndexPage from "../../pages/index";
import { BlogCard } from "../../interfaces/blog";

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

jest.mock("../../sections/interests/interests", () => ({
  __esModule: true,
  default: () => <section data-testid="interests" />,
}));

jest.mock("../../sections/blog/blog", () => ({
  __esModule: true,
  default: () => <section data-testid="blog" />,
}));

jest.mock("../../sections/map/map", () => ({
  Map: () => <section data-testid="map" />,
}));

const mockBannerData = { headline: "Hello World" };

const mockAboutData = {
  experience: [{ title: "Software Engineer", company: "Acme" }],
  interests: ["Coding", "Music"],
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

describe("IndexPage", () => {
  it("renders all sections when full data is provided", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={mockAboutData}
        blogs={mockBlogs}
      />,
    );
    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getByTestId("about")).toBeInTheDocument();
    expect(screen.getByTestId("experience")).toBeInTheDocument();
    expect(screen.getByTestId("interests")).toBeInTheDocument();
    expect(screen.getByTestId("blog")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
  });

  it("does not render banner when bannerData is absent", () => {
    render(
      <IndexPage
        bannerData={null}
        aboutData={mockAboutData}
        blogs={mockBlogs}
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
      />,
    );
    expect(screen.queryByTestId("experience")).not.toBeInTheDocument();
  });

  it("does not render interests section when interests is absent", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={{ ...mockAboutData, interests: undefined }}
        blogs={mockBlogs}
      />,
    );
    expect(screen.queryByTestId("interests")).not.toBeInTheDocument();
  });

  it("does not render map when countriesVisited is absent", () => {
    render(
      <IndexPage
        bannerData={mockBannerData}
        aboutData={{ ...mockAboutData, countriesVisited: undefined }}
        blogs={mockBlogs}
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
      />,
    );
    expect(screen.getByTestId("blog")).toBeInTheDocument();
  });
});
