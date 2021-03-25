const path = require('path');

module.exports = {
  env: {
    seoLogo: 'https://ps011.github.io/assets/images/logos/logo.png',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
