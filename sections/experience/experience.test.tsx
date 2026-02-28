import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Experience, { ExperienceItem } from "./experience";

const mockExperience: ExperienceItem[] = [
  {
    logo: "/logos/acme.svg",
    designation: "Senior Engineer",
    company: "Acme Corp",
    from: "2020",
    to: "2024",
    location: "Remote",
    technologies: ["React", "TypeScript", "Node.js"],
  },
  {
    logo: "",
    designation: "Junior Dev",
    company: "Startup",
    from: "2018",
    to: "2020",
    location: "NYC",
    technologies: ["JavaScript"],
  },
];

describe("Experience", () => {
  it("renders the experience section", () => {
    render(<Experience experience={mockExperience} />);
    expect(document.getElementById("experience")).toBeInTheDocument();
  });

  it("renders Experience heading", () => {
    render(<Experience experience={mockExperience} />);
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
  });

  it("renders all experience entries", () => {
    render(<Experience experience={mockExperience} />);
    expect(screen.getByText(/Senior Engineer @ Acme Corp/)).toBeInTheDocument();
    expect(screen.getByText(/Junior Dev @ Startup/)).toBeInTheDocument();
  });

  it("renders date ranges", () => {
    render(<Experience experience={mockExperience} />);
    expect(screen.getByText("2020 – 2024")).toBeInTheDocument();
    expect(screen.getByText("2018 – 2020")).toBeInTheDocument();
  });

  it("renders company logo when provided", () => {
    render(<Experience experience={mockExperience} />);
    expect(screen.getByAltText("Acme Corp logo")).toBeInTheDocument();
  });

  it("renders dash when logo is empty", () => {
    render(<Experience experience={mockExperience} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("expands accordion to show technologies", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Experience experience={mockExperience} />);
    const trigger = screen.getByRole("button", { name: /Senior Engineer @ Acme Corp/ });
    await user.click(trigger);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });
});
