import { render, screen } from "@testing-library/react";
import Blog from "./blog";
import { BlogCard } from "../../interfaces/blog";

const createBlog = (overrides: Partial<BlogCard> = {}): BlogCard => ({
  title: "Test Post",
  shortDescription: "A test description",
  thumbnail: "/thumb.jpg",
  tags: "react,typescript",
  link: "test-post",
  hidden: false,
  date: "2024-01-15",
  type: "blog",
  ...overrides,
});

describe("Blog", () => {
  it("renders nothing when blogs array is empty", () => {
    const { container } = render(<Blog blogs={[]} />);
    expect(container.querySelector("section")).not.toBeInTheDocument();
  });

  it("filters out hidden blogs", () => {
    const blogs: BlogCard[] = [
      createBlog({ title: "Visible", hidden: false, link: "visible" }),
      createBlog({ title: "Hidden", hidden: true, link: "hidden" }),
    ];
    render(<Blog blogs={blogs} />);
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("sorts blogs by date descending", () => {
    const blogs: BlogCard[] = [
      createBlog({ title: "Older", date: "2024-01-01", link: "older-post" }),
      createBlog({ title: "Newer", date: "2024-06-01", link: "newer-post" }),
    ];
    render(<Blog blogs={blogs} />);
    const items = screen.getAllByText(/Older|Newer/);
    const newerIndex = items.findIndex((el) => el.textContent === "Newer");
    const olderIndex = items.findIndex((el) => el.textContent === "Older");
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it("groups blogs by type and renders section heading", () => {
    const blogs: BlogCard[] = [
      createBlog({ title: "Post 1", type: "blog", link: "post-1" }),
      createBlog({ title: "Post 2", type: "blog", link: "post-2" }),
    ];
    render(<Blog blogs={blogs} />);
    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("converts kebab-case type to sentence case for heading", () => {
    const blogs: BlogCard[] = [
      createBlog({ title: "Post", type: "tech-talks" }),
    ];
    render(<Blog blogs={blogs} />);
    expect(screen.getByRole("heading", { name: "Tech Talks" })).toBeInTheDocument();
  });

  it("renders Read more links for each blog", () => {
    const blogs: BlogCard[] = [
      createBlog({ link: "my-post" }),
    ];
    render(<Blog blogs={blogs} />);
    const readMoreLinks = screen.getAllByRole("link", { name: /Read more/i });
    expect(readMoreLinks.length).toBeGreaterThanOrEqual(1);
    expect(readMoreLinks[0]).toHaveAttribute("href", "/blog/my-post");
  });
});
