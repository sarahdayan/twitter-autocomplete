const OFF = 0;

module.exports = {
  extends: ['algolia', 'algolia/react', 'algolia/typescript'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': OFF,
  },
  overrides: [
    {
      files: ['*.*.js', '*.config.js'],
      rules: {
        'import/no-commonjs': OFF,
        '@typescript-eslint/no-var-requires': OFF,
      },
    },
  ],
};
