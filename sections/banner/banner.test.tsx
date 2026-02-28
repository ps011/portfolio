import { render, screen } from "@testing-library/react";
import Banner from "./banner";

describe("Banner", () => {
  const defaultProps = {
    illustration: "/images/hero.svg",
    texts: ["Developer", "Designer"],
    ctaLabel: "Download CV",
    ctaUrl: "/cv.pdf",
    downloadable: true,
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the section with id banner", () => {
    render(<Banner {...defaultProps} />);
    expect(document.getElementById("banner")).toBeInTheDocument();
  });

  it("renders Hi, I'm text", () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByText(/Hi, I'm/i)).toBeInTheDocument();
  });

  it("renders CTA button when ctaLabel is provided", () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByRole("link", { name: /Download CV/i })).toBeInTheDocument();
  });

  it("CTA link has correct href and download attribute", () => {
    render(<Banner {...defaultProps} />);
    const link = screen.getByRole("link", { name: /Download CV/i });
    expect(link).toHaveAttribute("href", "/cv.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("does not render CTA when ctaLabel is empty", () => {
    render(<Banner {...defaultProps} ctaLabel="" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders typewriter element with data attributes", () => {
    render(<Banner {...defaultProps} />);
    const typewrite = document.getElementById("typewrite");
    expect(typewrite).toBeInTheDocument();
    expect(typewrite).toHaveAttribute("data-type", JSON.stringify(["Developer", "Designer"]));
  });
});
