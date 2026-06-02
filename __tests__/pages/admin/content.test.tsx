import { render, screen } from "@testing-library/react";
import ContentAdminPage from "../../../pages/admin/content";

describe("/admin/content", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders a password-protected content editor", async () => {
    render(<ContentAdminPage />);

    expect(await screen.findByRole("heading", { name: "Content Admin" })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("constrains authenticated editor fields to the content container", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        files: ["site.json", "about.json", "blogs.json", "gallery.json"],
        content: {
          "about.json": {
            name: "Prasheel",
            imageUrl: "https://res.cloudinary.com/demo/image/upload/example.jpg",
            bio: "<p>About me</p>",
            profiles: [],
            experience: [],
            skills: [],
            countriesVisited: [],
          },
        },
      }),
    }) as unknown as typeof fetch;

    render(<ContentAdminPage />);

    const imageUrl = await screen.findByLabelText("Image URL");
    const bio = screen.getByLabelText("Bio HTML");

    expect(imageUrl).toHaveClass("min-w-0");
    expect(imageUrl).toHaveClass("w-full");
    expect(bio).toHaveClass("min-w-0");
    expect(bio).toHaveClass("w-full");
  });
});
