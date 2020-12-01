// const path = require("path");

module.exports = {
  build: {
    addModernJS: true,
  },
  webpack: {
    //   optimization: {
    //     splitChunks: {
    //       chunks: "all",
    //     },
    //   },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  },
};
