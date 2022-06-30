/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
const defaultPathOptions = {
  documentRoot: '.',
  buildPath: 'dist',
  userSrcPath: 'src',
  publicPath: './',
  runtimePublicPath: null,
}
// default extendsOption
const defaultExtendOpt = {
  amdNamespace: null,
  // !!!IMPORTANT: DO NOT TOUCH!!!,
  // !!!WARNING: NO NOT edit to "null" or "false"
  amdName: undefined,
  // default, external all deps, important!! DO NOT TOUCH!!
  externalAll: true,
  externalResolver: null,
  externalExcludes: [],
  externalIncludes: [],
}

const defaultWebpackOptions = {
  extends: [],
  paths: defaultPathOptions,
  sourceMap: false,
  extractCSS: true,
  webpackCopy: null,
  devServerMiddleware: null,
  webpackCallback: null,
}

const initWebpackConfig = (webpackOptions) => {
  const { isDevelopment, sourceMap, paths } = webpackOptions
  const webpackConfig = {
    mode: isDevelopment ? 'development' : 'production',
    context: paths.documentRoot,
    entry: null,
    devtool: isDevelopment
      ? 'cheap-module-source-map'
      : 'hidden-source-map',
    output: {
      filename: '[name].js',
      chunkFilename: 'chunks/[name]-[hash].js',
      // CUSTOM OUTPUT FILENAME
      assetModuleFilename: 'assets/[hash][ext][query]',
      // AVOID NAMING CONFLICT
      path: paths.buildPath,
      publicPath: paths.targetURL,
    },
    module: {
      rules: {},
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      modules: [paths.userNodeModulesPath],
      mainFiles: ['index'],
      alias: {
        '@': paths.userSrcPath,
      },
      plugins: [],
    },
    externals: {},
    target: ['web', 'es5'],
    plugins: [],
    stats: 'errors-only',
    performance: {
      hints: 'warning',
      // 8MB
      maxAssetSize: 8 * 1024 * 1024,
      maxEntrypointSize: 8 * 1024 * 1024,
    },
    devServer: {
      inline: true,
      disableHostCheck: true,
    },
    optimization: {
      minimizer: [],
      nodeEnv: process.env.NODE_ENV,
      splitChunks: {
        cacheGroups: {},
      },
    },
  }

  if (sourceMap && typeof sourceMap === 'string') {
    webpackConfig.devtool = sourceMap
  } else if (!isDevelopment && !sourceMap) {
    webpackConfig.devtool = false
  }

  return webpackConfig
}

export default {
  defaultPathOptions,
  defaultExtendOpt,
  defaultWebpackOptions,
  initWebpackConfig,
}
