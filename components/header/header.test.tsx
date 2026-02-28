import { render, screen } from "@testing-library/react";
import { Header } from "./header";

jest.mock("@/components/theme-switcher/theme-switcher", () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher" />,
}));

const navMap = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
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

  it("renders desktop and mobile nav links", () => {
    render(<Header logoUrl="/logo.png" navMap={navMap} />);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Blog").length).toBeGreaterThanOrEqual(1);
  });

  it("prefixes relative hrefs with a slash", () => {
    const relativeNavMap = [{ href: "contact", label: "Contact" }];
    render(<Header logoUrl="/logo.png" navMap={relativeNavMap} />);
    const links = screen.getAllByRole("link", { name: "Contact" });
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  it("passes through already-absolute hrefs unchanged", () => {
    const absoluteNavMap = [{ href: "/dev", label: "Dev" }];
    render(<Header logoUrl="/logo.png" navMap={absoluteNavMap} />);
    const links = screen.getAllByRole("link", { name: "Dev" });
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
