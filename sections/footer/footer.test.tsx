import { render, screen } from "@testing-library/react";
import Footer from "./footer";

jest.mock("../../components/profile/profile", () => ({
  __esModule: true,
  default: ({ name, url }: { name: string; url: string }) => (
    <a href={url} data-testid={`profile-${name}`}>
      {name}
    </a>
  ),
}));

describe("Footer", () => {
  const mockProfiles = [
    { name: "github", url: "https://github.com/user" },
    { name: "linkedin", url: "https://linkedin.com/in/user" },
  ];

  it("renders thank you heading", () => {
    render(<Footer profiles={mockProfiles} />);
    expect(screen.getByText("Thank you for stopping by!")).toBeInTheDocument();
  });

  it("renders get in touch message", () => {
    render(<Footer profiles={mockProfiles} />);
    expect(screen.getByText(/Let's get in touch on any of these platforms/)).toBeInTheDocument();
  });

  it("renders profile links", () => {
    render(<Footer profiles={mockProfiles} />);
    expect(screen.getByTestId("profile-github")).toBeInTheDocument();
    expect(screen.getByTestId("profile-linkedin")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer profiles={mockProfiles} />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
  });

  it("renders Prasheel link", () => {
    render(<Footer profiles={mockProfiles} />);
    const link = screen.getByRole("link", { name: "Prasheel" });
    expect(link).toHaveAttribute("href", "https://linkedin.com/in/ps011");
  });

  it("renders License link", () => {
    render(<Footer profiles={mockProfiles} />);
    const link = screen.getByRole("link", { name: "License" });
    expect(link).toHaveAttribute("href", "https://github.com/ps011/ps11/LICENSE.md");
  });

  it("renders nothing for profiles when array is empty", () => {
    render(<Footer profiles={[]} />);
    expect(screen.queryByTestId("profile-github")).not.toBeInTheDocument();
  });
});
