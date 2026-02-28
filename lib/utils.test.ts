import { cn } from "./utils";

describe("cn", () => {
  it("combines class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
  });

  it("resolves tailwind class conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles object syntax", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500",
    );
  });

  it("handles array syntax", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("deduplicates conflicting background colors", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });
});
