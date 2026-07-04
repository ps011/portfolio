import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import About from "./about";

jest.mock("@/components/profile/profile", () => ({
  __esModule: true,
  default: ({ name, url }: { name: string; url: string }) => (
    <a href={url} data-testid={`profile-${name}`}>
      {name}
    </a>
  ),
}));

const defaultProps = {
  about: "<p>I am a software engineer.</p>",
  skills: [
    { logo: "/logos/react.svg", name: "React" },
    { logo: "/logos/ts.svg", name: "TypeScript" },
  ],
  imageUrl: "/avatar.jpg",
  name: "John Doe",
  location: "San Francisco",
  designation: "Software Engineer",
  education: "MIT",
  stats: [
    { count: 5, label: "Years" },
    { count: 10, label: "Projects" },
  ],
  profiles: [
    { name: "github", url: "https://github.com/john" },
    { name: "linkedin", url: "https://linkedin.com/in/john" },
  ],
  interests: [
    { title: "Blogging", description: "I write about tech." },
    { title: "Photography", description: "I love taking photos." },
    { title: "Coding", description: "Building software." },
    { title: "Music", description: "Playing guitar." },
  ],
};

describe("About", () => {
  it("renders the about section", () => {
    render(<About {...defaultProps} />);
    expect(document.getElementById("about")).toBeInTheDocument();
  });

  it("renders name, location, designation, and education", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  it("renders stats", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Years of Experience")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Countries travelled")).toBeInTheDocument();
  });

  it("renders profile links", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByTestId("profile-github")).toBeInTheDocument();
    expect(screen.getByTestId("profile-linkedin")).toBeInTheDocument();
  });

  it("renders about text directly without interaction", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText(/Hey there! Welcome to my world/)).toBeInTheDocument();
  });

  it("uses editable name and bio values when provided", () => {
    render(
      <About
        {...defaultProps}
        name="Editable Name"
        bio="<p>Editable bio from remote JSON.</p>"
      />,
    );

    expect(screen.getByText("Editable Name")).toBeInTheDocument();
    expect(screen.getByText("Editable bio from remote JSON.")).toBeInTheDocument();
  });

  it("renders interests inside about section", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText("Travelling & Photography")).toBeInTheDocument();
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Blogging")).toBeInTheDocument();
  });

  it("renders blog CTA for blogging interest", () => {
    render(<About {...defaultProps} />);
    const link = screen.getByRole("link", { name: /View My Blog Posts/i });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("renders gallery CTA for photography interest", () => {
    render(<About {...defaultProps} />);
    const link = screen.getByRole("link", { name: /Explore Photo Gallery/i });
    expect(link).toHaveAttribute("href", "/photo-gallery");
  });

  it("renders GitHub CTA for coding interest", () => {
    render(<About {...defaultProps} />);
    const link = screen.getByRole("link", { name: /View My GitHub/i });
    expect(link).toHaveAttribute("href", "https://github.com/ps011");
  });

  it("renders Coming Soon for unknown interests", () => {
    render(<About {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /Coming Soon/i }),
    ).toBeDisabled();
  });

  it("does not render interests block when interests is empty", () => {
    render(<About {...defaultProps} interests={[]} />);
    expect(
      screen.queryByRole("link", { name: /View My Blog Posts/i }),
    ).not.toBeInTheDocument();
  });
});
