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
});
