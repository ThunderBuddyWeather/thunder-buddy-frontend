module.exports = {
  plugins: {
    'nativewind/postcss': {
      // This ensures proper handling of async operations
      suppressLogging: true,
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
