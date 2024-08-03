const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["res.cloudinary.com", "stackoverflow.com", "scontent-hel3-1.cdninstagram.com"],
  },
  eslint: {
    dirs: ["sections", "components", "pages", "interfaces", "lib"],
  },
};
