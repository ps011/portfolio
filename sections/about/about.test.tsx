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
    expect(screen.getByText("Years")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("renders profile links", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByTestId("profile-github")).toBeInTheDocument();
    expect(screen.getByTestId("profile-linkedin")).toBeInTheDocument();
  });

  it("renders About Me and Skills cards when collapsed", () => {
    render(<About {...defaultProps} />);
    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
  });

  it("expands About Me card on click and shows full content", async () => {
    const user = userEvent.setup({ delay: null });
    render(<About {...defaultProps} />);
    const aboutCard = screen.getAllByText("About Me")[0];
    await user.click(aboutCard.closest("[class*='cursor-pointer']")!);
    expect(screen.getByText("I am a software engineer.")).toBeInTheDocument();
  });

  it("expands Skills card on click and shows all skills", async () => {
    const user = userEvent.setup({ delay: null });
    render(<About {...defaultProps} />);
    const skillsCard = screen.getAllByText("Skills")[0];
    await user.click(skillsCard.closest("[class*='cursor-pointer']")!);
    expect(screen.getByAltText("React")).toBeInTheDocument();
    expect(screen.getByAltText("TypeScript")).toBeInTheDocument();
  });

  it("truncates long about text in collapsed card", () => {
    const longAbout = "a".repeat(250);
    render(<About {...defaultProps} about={longAbout} />);
    expect(screen.getByText(/a{200}\.\.\./)).toBeInTheDocument();
  });

  it("shows +N more for skills when more than 8", () => {
    const manySkills = Array.from({ length: 10 }, (_, i) => ({
      logo: `/logo-${i}.svg`,
      name: `Skill${i}`,
    }));
    render(<About {...defaultProps} skills={manySkills} />);
    expect(screen.getByText("+2 more. Click to see all")).toBeInTheDocument();
  });
});
