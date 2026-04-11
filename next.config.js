const path = require("path");

module.exports = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
  compiler: {
    emotion: false,
  },
};
