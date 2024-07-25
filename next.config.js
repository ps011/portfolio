const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["res.cloudinary.com", "fast-cove-20932.herokuapp.com", "stackoverflow.com", "scontent-hel3-1.cdninstagram.com"],
  },
  eslint: {
    dirs: ["sections", "components", "pages", "interfaces", "lib"],
  },
};
