/** @format */

module.exports = {
  type: "react",
  build: {
    entry: process.env.IS_FOR_APPLE_NEWS
      ? ["embeds"]
      : ["index", "embeds"],
    includedDependencies: [/\/d3-/, "fuse.js"]
  },
  webpack: config => {
    if (process.env.IS_FOR_APPLE_NEWS) {
      delete config.devtool;
    }

    return {
      ...config,
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      }
    };
  },
  ...(process.env.IS_FOR_APPLE_NEWS
    ? {
        deploy: [
          {
            profile: "applenews",
            resolvePublicPath: () => "bundle://",
            to: "N/A"
          }
        ]
      }
    : {})
};
