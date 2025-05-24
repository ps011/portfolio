const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["res.cloudinary.com", "cdn.hashnode.com"],
  },
  eslint: {
    dirs: ["sections", "components", "pages", "interfaces", "lib"],
  },
  compiler: {
    emotion: false,
  },
};
