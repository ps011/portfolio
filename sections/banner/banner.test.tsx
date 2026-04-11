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

  it("renders CTA button with translated label", () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByRole("link", { name: /Resume/i })).toBeInTheDocument();
  });

  it("CTA link has correct href and download attribute", () => {
    render(<Banner {...defaultProps} />);
    const link = screen.getByRole("link", { name: /Resume/i });
    expect(link).toHaveAttribute("href", "/cv.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("renders typewriter element with translated texts", () => {
    render(<Banner {...defaultProps} />);
    const typewrite = document.getElementById("typewrite");
    expect(typewrite).toBeInTheDocument();
    expect(typewrite).toHaveAttribute(
      "data-type",
      JSON.stringify(["Prasheel Soni", "Engineer", "Traveller", "From India \ud83c\uddee\ud83c\uddf3", "Living in Estonia \ud83c\uddea\ud83c\uddea"]),
    );
  });
});
