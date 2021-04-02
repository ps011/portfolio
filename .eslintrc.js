module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    semi: [0, 'always'],
    'react/react-in-jsx-scope': [0, 'always'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': [1, {
      html: 'enforce',
      custom: 'enforce',
    }],
    'jsx-a11y/no-static-element-interactions': [0, 'always'],
    'jsx-a11y/click-events-have-key-events': [0, 'always'],
    'jsx-a11y/anchor-is-valid': [0, 'always'],
  },
};
