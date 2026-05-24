import { render, screen } from "@testing-library/react";
import { Header } from "./header";

jest.mock("@prasheel/ui", () => ({
  ...jest.requireActual("@prasheel/ui"),
  ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));

const navMap = [
  { href: "/about" },
  { href: "/random" },
];

describe("Header", () => {
  it("renders the logo image", () => {
    render(<Header logoUrl="/logo.png" />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Logo")).toHaveAttribute(
      "src",
      expect.stringContaining("logo.png"),
    );
  });

  it("logo links to the home page", () => {
    render(<Header logoUrl="/logo.png" />);
    const logoLink = screen.getByRole("link", { name: /logo/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders desktop and mobile nav links (falls back to href when not in navKeyMap)", () => {
    render(<Header logoUrl="/logo.png" navMap={navMap} />);
    expect(screen.getAllByText("/about").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("/random").length).toBeGreaterThanOrEqual(1);
  });

  it("uses navKeyMap translations for known hrefs", () => {
    render(
      <Header logoUrl="/logo.png" navMap={[{ href: "#about" }]} />,
    );
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
  });

  it("prefixes relative hrefs with a slash", () => {
    const relativeNavMap = [{ href: "contact" }];
    render(<Header logoUrl="/logo.png" navMap={relativeNavMap} />);
    const links = screen.getAllByRole("link", { name: "contact" });
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  it("passes through already-absolute hrefs unchanged", () => {
    const absoluteNavMap = [{ href: "/dev" }];
    render(<Header logoUrl="/logo.png" navMap={absoluteNavMap} />);
    const links = screen.getAllByRole("link", { name: "/dev" });
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/dev");
    });
  });

  it("renders no nav links when navMap is empty", () => {
    render(<Header logoUrl="/logo.png" navMap={[]} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders the theme switcher", () => {
    render(<Header logoUrl="/logo.png" />);
    expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
  });
});
