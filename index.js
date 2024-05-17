const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const paths = require("react-scripts/config/paths");

const getModuleFederationConfigPath = (additionalPaths = []) => {
  const path = require("path");
  const fs = require("fs");
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

  const moduleFederationConfigFiles = [
    "modulefederation.config.js",
    ...additionalPaths,
  ];
  return moduleFederationConfigFiles
    .map(resolveApp)
    .filter(fs.existsSync)
    .shift();
};

module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
    const moduleFederationConfigPath = getModuleFederationConfigPath();

    if (moduleFederationConfigPath) {
      const moduleFederationConfig = require(moduleFederationConfigPath);
      webpackConfig.output.publicPath = "auto";

      if (pluginOptions?.useNamedChunkIds) {
        webpackConfig.optimization.chunkIds = "named";
      }

      const htmlWebpackPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
      );

      htmlWebpackPlugin.userOptions = {
        ...htmlWebpackPlugin.userOptions,
        publicPath: paths.publicUrlOrPath,
        excludeChunks: [moduleFederationConfig.name],
      };

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new ModuleFederationPlugin(moduleFederationConfig),
      ];

    }
    return webpackConfig;
  },
  overrideDevServerConfig: ({ devServerConfig }) => {
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    };

    return devServerConfig;
  },
};
