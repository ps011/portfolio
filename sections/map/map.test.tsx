import { render, screen } from "@testing-library/react";
import { Map } from "./map";

jest.mock("react-simple-maps", () => ({
  ComposableMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="composable-map">{children}</div>
  ),
  Geographies: ({
    geography,
    children,
  }: {
    geography: string;
    children: (props: { geographies: { rsmKey: string; id: string; properties: { name: string } }[] }) => React.ReactNode;
  }) => {
    const mockGeographies = [
      { rsmKey: "usa", id: "USA", properties: { name: "United States" } },
      { rsmKey: "can", id: "CAN", properties: { name: "Canada" } },
      { rsmKey: "ind", id: "IND", properties: { name: "India" } },
    ];
    return <div data-testid="geographies">{children({ geographies: mockGeographies })}</div>;
  },
  Geography: ({ geography }: { geography: { id: string } }) => (
    <div data-testid={`geo-${geography.id}`}>{geography.id}</div>
  ),
}));

describe("Map", () => {
  it("renders the map section", () => {
    render(<Map countriesVisited={["USA", "IND"]} />);
    expect(document.getElementById("map")).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<Map countriesVisited={["USA"]} />);
    expect(
      screen.getByRole("heading", {
        name: /How much of the World I've seen so far\?/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the map component", () => {
    render(<Map countriesVisited={[]} />);
    expect(screen.getByTestId("composable-map")).toBeInTheDocument();
  });

  it("renders geographies", () => {
    render(<Map countriesVisited={[]} />);
    expect(screen.getByTestId("geographies")).toBeInTheDocument();
  });

  it("accepts countriesVisited array", () => {
    render(<Map countriesVisited={["USA", "CAN", "IND"]} />);
    expect(screen.getByTestId("composable-map")).toBeInTheDocument();
  });
});
