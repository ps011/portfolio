import { render, screen } from "@testing-library/react";
import YouTube from "./youtube";
import type { YouTubeVideo } from "../../interfaces/youtube";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

const videos: YouTubeVideo[] = [
  {
    id: "ndefUGEmywM",
    title: "VIVID VILNIUS EPISODE 02",
    url: "https://www.youtube.com/watch?v=ndefUGEmywM",
    thumbnailUrl: "https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg",
    publishedAt: "2026-04-27T15:24:04+00:00",
  },
  {
    id: "l82IxaZMob0",
    title: "EPISODE 01",
    url: "https://www.youtube.com/watch?v=l82IxaZMob0",
    thumbnailUrl: "https://i1.ytimg.com/vi/l82IxaZMob0/hqdefault.jpg",
    publishedAt: "2026-04-19T09:08:08+00:00",
  },
];

describe("YouTube section", () => {
  it("renders nothing when there are no videos", () => {
    const { container } = render(<YouTube videos={[]} />);

    expect(container.querySelector("section")).not.toBeInTheDocument();
  });

  it("renders video cards with external links", () => {
    render(<YouTube videos={videos} />);

    expect(screen.getByRole("heading", { name: "Videos" })).toBeInTheDocument();
    expect(screen.getByText("VIVID VILNIUS EPISODE 02")).toBeInTheDocument();
    expect(screen.getByText("Apr 27, 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "VIVID VILNIUS EPISODE 02 thumbnail" }),
    ).toHaveAttribute(
      "src",
      "https://i3.ytimg.com/vi/ndefUGEmywM/hqdefault.jpg",
    );

    const links = screen.getAllByRole("link", { name: "Watch on YouTube" });
    expect(links[0]).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=ndefUGEmywM",
    );
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });
});
