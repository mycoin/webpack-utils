/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
const { extendIfNecessary, resolveWebpackPath } = require('./utils')

const defaultPathOptions = {
  documentRoot: '.',
  buildPath: 'build',
  userSrcPath: 'src',
  publicPath: '/',
}

const defaultWebpackOptions = {
  context: '.',
  paths: defaultPathOptions,

  postcssOptions: null,
  babelOptions: null,
  tsLoaderOptions: null,
  cssLoaderName: 'css-loader',
  scssLoaderName: 'sass-loader',
  tsLoaderName: 'ts-loader',

  assetsManifestOptions: null,
  liveReloadOptions: null,
  runtimePublicPath: null,
  copyOptions: null,
  commonChunks: null,
  statsOptions: null,
  middleware: null,
  processWebpack: null,
  afterBuilt: null,
}

const webpackOptionsValidator = (provideredOptions) => {
  const provideredOptionNames = Object.keys(provideredOptions)
  const validOptionKeyNames = Object.keys(defaultWebpackOptions).concat([
    'isDevelopment',
    'isProduction',

    'optimize',
  ])

  for (let index = 0; index < provideredOptionNames.length; index++) {
    const fieldItem = provideredOptionNames[index]
    if (validOptionKeyNames.indexOf(fieldItem) === -1) { // eslint-disable-line
      throw new TypeError(
        'webpackOptions has an unknown field "' + fieldItem + '", '
        + 'valid properties are: '
        + validOptionKeyNames.join(', ')
      )
    }
  }
  return true
}

const defaultWebpackConfig = (provideredPathOptions) => {
  const paths = resolveWebpackPath(extendIfNecessary(defaultPathOptions, provideredPathOptions))
  const webpackConfig = {
    target: 'web',
    context: paths.documentRoot,
    entry: null,
    output: {
      filename: '[name].js',
      path: paths.buildPath,
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
    plugins: [],
    devServer: {
      inline: true,
      disableHostCheck: true,
    },
  }
  return webpackConfig
}

module.exports = {
  defaultPathOptions,
  defaultWebpackOptions,
  defaultWebpackConfig,

  webpackOptionsValidator,
}
