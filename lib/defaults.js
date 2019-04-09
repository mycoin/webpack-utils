const webpack = require('webpack')
const { resolvePath, extendIfNecessary } = require('./utils')

const defaultPathOptions = resolvePath()
const defaultWebpackConfig = (passedPath) => {
  const paths = extendIfNecessary(defaultPathOptions, passedPath)
  const webpackConfig = {
    target: 'web',
    context: paths.documentRoot,
    entry: {},
    output: {
      filename: '[name].js',
      path: 'build',
      publicPath: paths.publicPath,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.vue'],
      mainFiles: ['index'],
      alias: {
        '@': paths.userSrcPath,
      },
    },
    module: {
      strictExportPresence: true,
    },
    node: {
      fs: 'empty',
    },
    stats: 'errors-only',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  }

  return webpackConfig
}

const defaultWebpackOptions = {
  isDevelopment: true,
  isProduction: false,
  context: '.',

  postcssOptions: null,
  babelOptions: null,
  cssLoaderName: 'css-loader',
  scssLoaderName: 'sass-loader',
  liveReloadOptions: null,
  runtimePublicPath: null,
  copyOptions: null,
  commonChunks: null,
  assetsManifestOptions: null,
  normalizedPaths: null,

  middleware: () => {},
  processWebpack: null,
  afterBuilt: null,
}

module.exports = {
  defaultPathOptions,
  defaultWebpackOptions,
  defaultWebpackConfig,
}
