import { render, screen } from "@testing-library/react";
import { Header } from "./header";
import { ThemeProvider } from "@prasheel/ui";

function renderHeader(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const navMap = [
  { href: "/about" },
  { href: "/random" },
];

describe("Header", () => {
  it("renders the logo image", () => {
    renderHeader(<Header logoUrl="/logo.png" />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Logo")).toHaveAttribute(
      "src",
      expect.stringContaining("logo.png"),
    );
  });

  it("logo links to the home page", () => {
    renderHeader(<Header logoUrl="/logo.png" />);
    const logoLink = screen.getByRole("link", { name: /logo/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders desktop and mobile nav links (falls back to href when not in navKeyMap)", () => {
    renderHeader(<Header logoUrl="/logo.png" navMap={navMap} />);
    expect(screen.getAllByText("/about").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("/random").length).toBeGreaterThanOrEqual(1);
  });

  it("uses navKeyMap translations for known hrefs", () => {
    renderHeader(
      <Header logoUrl="/logo.png" navMap={[{ href: "#about" }]} />,
    );
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
  });

  it("prefixes relative hrefs with a slash", () => {
    const relativeNavMap = [{ href: "contact" }];
    renderHeader(<Header logoUrl="/logo.png" navMap={relativeNavMap} />);
    const links = screen.getAllByRole("link", { name: "contact" });
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  it("passes through already-absolute hrefs unchanged", () => {
    const absoluteNavMap = [{ href: "/dev" }];
    renderHeader(<Header logoUrl="/logo.png" navMap={absoluteNavMap} />);
    const links = screen.getAllByRole("link", { name: "/dev" });
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/dev");
    });
  });

  it("renders no nav links when navMap is empty", () => {
    renderHeader(<Header logoUrl="/logo.png" navMap={[]} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders the theme switcher", () => {
    renderHeader(<Header logoUrl="/logo.png" />);
    expect(screen.getByRole("button", { name: "Choose theme color" })).toBeInTheDocument();
  });
});
