export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        "> 1%",
        "not dead",
        "not Safari < 9",
        "last 2 versions",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Safari versions",
      ],
    },
  },
}
