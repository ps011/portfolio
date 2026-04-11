import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "../../components/language-switcher/language-switcher";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, locale, ...props }: any) => (
    <a href={href} data-locale={locale} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from "next/router";
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("LanguageSwitcher", () => {
  it("renders nothing when only one locale is configured", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en"],
      locale: "en",
      asPath: "/",
    } as any);

    const { container } = render(<LanguageSwitcher />);
    expect(container.firstChild).toBeNull();
  });

  it("renders links for all locales when multiple are configured", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en", "es"],
      locale: "en",
      asPath: "/",
    } as any);

    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("ES")).toBeInTheDocument();
  });

  it("marks the current locale as active", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en", "es"],
      locale: "en",
      asPath: "/",
    } as any);

    render(<LanguageSwitcher />);
    const enLink = screen.getByText("EN");
    expect(enLink).toHaveAttribute("aria-current", "true");
    const esLink = screen.getByText("ES");
    expect(esLink).not.toHaveAttribute("aria-current");
  });

  it("passes the current path to locale links", () => {
    mockUseRouter.mockReturnValue({
      locales: ["en", "es"],
      locale: "en",
      asPath: "/blog/my-post",
    } as any);

    render(<LanguageSwitcher />);
    const esLink = screen.getByText("ES");
    expect(esLink.closest("a")).toHaveAttribute("data-locale", "es");
  });
});
