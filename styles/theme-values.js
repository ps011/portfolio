const themeValues = {
  colors: {
    brandMutedYellow: [
      "#FEF6E8", "#FCEFDB", "#F9E7CE", "#F5DEC0", "#F1D6B1",
      "#DAB88B", "#C3A07A", "#AC8A69", "#957558", "#7E6147",
    ],
    accentSlateBlue: [
      "#EAF0F7", "#DDE4EE", "#CED8E5", "#BAC6DC", "#A6B4D3",
      "#8F9FC9", "#778DA9", "#657A94", "#54677F", "#43546A",
    ],
    neutralGray: [
      "#FFFFFF", "#F8F9FA", "#F1F3F5", "#E9ECEF", "#DEE2E6",
      "#CED4DA", "#ADB5BD", "#868E96", "#495057", "#343A40",
    ],
    dark: [
      "#FFFFFF", "#F8F9FA", "#F1F3F5", "#E9ECEF", "#DEE2E6",
      "#CED4DA", "#ADB5BD", "#868E96", "#495057", "#343A40",
    ],
  },
  primaryColor: "brandMutedYellow",
  white: "#FFFFFF",
  black: "#343A40",
  fontFamily: "Inter, sans-serif",
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.3" },
      h2: { fontSize: "2rem", lineHeight: "1.35" },
      h3: { fontSize: "1.75rem", lineHeight: "1.4" },
      h4: { fontSize: "1.5rem", lineHeight: "1.45" },
    },
  },
  other: {
    primaryPageBackground: "#F8F9FA",
    cardBackground: "#FFFFFF",
    primaryText: "#343A40",
    secondaryText: "#868E96",
    accentYellow: "#DAB88B",
  },
};

module.exports = { themeValues };
