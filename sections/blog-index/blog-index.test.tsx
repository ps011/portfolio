import { render, screen, fireEvent, within } from "@testing-library/react";
import BlogIndex from "./blog-index";
import type { BlogCard } from "../../interfaces/blog";

const createBlog = (overrides: Partial<BlogCard> = {}): BlogCard => ({
  title: "Test Post",
  shortDescription: "A test description",
  thumbnail: "/thumb.jpg",
  tags: "",
  link: "test-post",
  hidden: false,
  date: "2024-01-15",
  type: "blogs",
  ...overrides,
});

const blogsFixture: BlogCard[] = [
  createBlog({
    title: "Living in Estonia",
    shortDescription: "A year in Tallinn",
    tags: "travel, europe",
    link: "estonia",
  }),
  createBlog({
    title: "Switching Jobs",
    shortDescription: "Career advice from personal experience",
    tags: "career",
    link: "switching-jobs",
  }),
  createBlog({
    title: "A Trip to Ladakh",
    shortDescription: "Mountains and lakes",
    tags: "travel",
    link: "ladakh",
  }),
];

describe("BlogIndex", () => {
  it("renders all blogs by default", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    expect(screen.getByText("Living in Estonia")).toBeInTheDocument();
    expect(screen.getByText("Switching Jobs")).toBeInTheDocument();
    expect(screen.getByText("A Trip to Ladakh")).toBeInTheDocument();
  });

  it("filters by search query against title (case-insensitive)", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    const input = screen.getByLabelText(/search blogs/i);
    fireEvent.change(input, { target: { value: "ESTONIA" } });
    expect(screen.getByText("Living in Estonia")).toBeInTheDocument();
    expect(screen.queryByText("Switching Jobs")).not.toBeInTheDocument();
    expect(screen.queryByText("A Trip to Ladakh")).not.toBeInTheDocument();
  });

  it("filters by search query against shortDescription", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    const input = screen.getByLabelText(/search blogs/i);
    fireEvent.change(input, { target: { value: "tallinn" } });
    expect(screen.getByText("Living in Estonia")).toBeInTheDocument();
    expect(screen.queryByText("Switching Jobs")).not.toBeInTheDocument();
  });

  it("filters by tag chip and restores list with 'All'", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    fireEvent.click(screen.getByRole("button", { name: "career" }));
    expect(screen.getByText("Switching Jobs")).toBeInTheDocument();
    expect(screen.queryByText("Living in Estonia")).not.toBeInTheDocument();
    expect(screen.queryByText("A Trip to Ladakh")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Living in Estonia")).toBeInTheDocument();
    expect(screen.getByText("Switching Jobs")).toBeInTheDocument();
    expect(screen.getByText("A Trip to Ladakh")).toBeInTheDocument();
  });

  it("combines search and tag filter with AND logic", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    fireEvent.click(screen.getByRole("button", { name: "travel" }));
    const input = screen.getByLabelText(/search blogs/i);
    fireEvent.change(input, { target: { value: "ladakh" } });
    expect(screen.getByText("A Trip to Ladakh")).toBeInTheDocument();
    expect(screen.queryByText("Living in Estonia")).not.toBeInTheDocument();
    expect(screen.queryByText("Switching Jobs")).not.toBeInTheDocument();
  });

  it("shows the no-results message when filters match nothing", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    const input = screen.getByLabelText(/search blogs/i);
    fireEvent.change(input, { target: { value: "zzznothing" } });
    expect(
      screen.getByText(/no blogs match your search/i),
    ).toBeInTheDocument();
  });

  it("omits the tag chip row when no blogs have tags", () => {
    const blogs = [
      createBlog({ title: "A", tags: "", link: "a" }),
      createBlog({ title: "B", tags: "", link: "b" }),
    ];
    render(<BlogIndex blogs={blogs} />);
    expect(screen.queryByRole("button", { name: "All" })).not.toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("derives tag chips from the union of blog tags, sorted", () => {
    render(<BlogIndex blogs={blogsFixture} />);
    const all = screen.getByRole("button", { name: "All" });
    const region = all.parentElement as HTMLElement;
    const tagButtons = within(region)
      .getAllByRole("button")
      .map((b) => b.textContent);
    expect(tagButtons).toEqual(["All", "career", "europe", "travel"]);
  });

  it("supports tags provided as a string array", () => {
    const blogs = [
      createBlog({
        title: "Array Tags",
        tags: ["alpha", "beta"] as unknown as string,
        link: "array-tags",
      }),
    ];
    render(<BlogIndex blogs={blogs} />);
    expect(screen.getByRole("button", { name: "alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "beta" })).toBeInTheDocument();
  });
});
