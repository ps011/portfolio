module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    "tailwindcss": {},
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        // Optional: define Mantine breakpoints here if needed by your setup,
        // though with Mantine v7+ CSS variables, this might be less critical.
        // 'mantine-breakpoint-xs': '36em',
        // 'mantine-breakpoint-sm': '48em',
        // 'mantine-breakpoint-md': '62em',
        // 'mantine-breakpoint-lg': '75em',
        // 'mantine-breakpoint-xl': '88em',
      },
    },
    "autoprefixer": {},
  },
};
