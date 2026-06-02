import { render, screen } from "@testing-library/react";
import ContentAdminPage from "../../../pages/admin/content";

jest.mock("@prasheel/ui", () => {
  const React = jest.requireActual<typeof import("react")>("react");

  const Button = ({ children, ...props }: React.ComponentProps<"button">) => (
    <button data-prasheel-ui="button" {...props}>
      {children}
    </button>
  );
  Button.displayName = "MockButton";

  const Card = ({ children, ...props }: React.ComponentProps<"div">) => (
    <div data-prasheel-ui="card" {...props}>
      {children}
    </div>
  );
  Card.displayName = "MockCard";

  const CardContent = ({ children, ...props }: React.ComponentProps<"div">) => (
    <div data-prasheel-ui="card-content" {...props}>
      {children}
    </div>
  );
  CardContent.displayName = "MockCardContent";

  const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
  >((props, ref) => <input ref={ref} data-prasheel-ui="checkbox" {...props} />);
  Checkbox.displayName = "MockCheckbox";

  const Input = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
  >((props, ref) => <input ref={ref} data-prasheel-ui="input" {...props} />);
  Input.displayName = "MockInput";

  const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
  >((props, ref) => (
    <textarea ref={ref} data-prasheel-ui="textarea" {...props} />
  ));
  Textarea.displayName = "MockTextarea";

  return {
    Button,
    Card,
    CardContent,
    Checkbox,
    Input,
    Textarea,
  };
});

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
    expect(imageUrl).toHaveAttribute("data-prasheel-ui", "input");
    expect(bio).toHaveAttribute("data-prasheel-ui", "textarea");
  });
});
