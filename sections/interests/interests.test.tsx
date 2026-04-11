import { render, screen } from "@testing-library/react";
import Interests from "./interests";

const defaultInterests = [
  { title: "Blogging", description: "I write about tech." },
  { title: "Photography", description: "I love taking photos." },
  { title: "Coding", description: "Building software." },
  { title: "Music", description: "Playing guitar." },
];

describe("Interests", () => {
  it("renders the interests section", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    expect(document.getElementById("interests")).toBeInTheDocument();
  });

  it("renders all interest titles and descriptions from translations", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    expect(screen.getByText("Travelling & Photography")).toBeInTheDocument();
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Blogging")).toBeInTheDocument();
    expect(screen.getByText("about.interest3Title")).toBeInTheDocument();
  });

  it("renders View My Blog Posts for blogging interest", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    const link = screen.getByRole("link", { name: /View My Blog Posts/i });
    expect(link).toHaveAttribute("href", "/blog");
  });

  it("renders Explore Photo Gallery for photography interest", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    const link = screen.getByRole("link", { name: /Explore Photo Gallery/i });
    expect(link).toHaveAttribute("href", "/photo-gallery");
  });

  it("renders View My GitHub for coding interest", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    const link = screen.getByRole("link", { name: /View My GitHub/i });
    expect(link).toHaveAttribute("href", "https://github.com/ps011");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders Coming Soon disabled button for other interests", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    const button = screen.getByRole("button", { name: /Coming Soon/i });
    expect(button).toBeDisabled();
  });

  it("classifies writing as blogging", () => {
    render(
      <Interests
        illustration="/interests.svg"
        interests={[{ title: "Writing", description: "Essays" }]}
      />,
    );
    expect(screen.getByRole("link", { name: /View My Blog Posts/i })).toBeInTheDocument();
  });

  it("classifies camera as photography", () => {
    render(
      <Interests
        illustration="/interests.svg"
        interests={[{ title: "Camera", description: "DSLR" }]}
      />,
    );
    expect(screen.getByRole("link", { name: /Explore Photo Gallery/i })).toBeInTheDocument();
  });

  it("classifies programming as coding", () => {
    render(
      <Interests
        illustration="/interests.svg"
        interests={[{ title: "Programming", description: "Code" }]}
      />,
    );
    expect(screen.getByRole("link", { name: /View My GitHub/i })).toBeInTheDocument();
  });

  it("renders illustration with correct alt", () => {
    render(<Interests illustration="/interests.svg" interests={defaultInterests} />);
    expect(screen.getByAltText("Interests")).toBeInTheDocument();
  });

  it("renders nothing for interests when array is empty", () => {
    render(<Interests illustration="/interests.svg" interests={[]} />);
    expect(document.getElementById("interests")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View My Blog Posts/i })).not.toBeInTheDocument();
  });
});
