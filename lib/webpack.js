/* eslint-disable global-require, prefer-template */

const webpack = require('webpack')
const merge = require('webpack-merge')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const RuntimePublicPathPlugin = require('webpack-runtime-public-path-plugin')

const WarningsToErrorsPlugin = require('warnings-to-errors-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const WebpackLiveReloadPlugin = require('webpack-livereload-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')

const { requireGivenModule, resolveStatsOptions, resolveWebpackPath } = require('./utils')
const { initBabelOptions, initPostcssOptions, initTSOptions } = require('./presets/')
const { webpackOptionsValidator } = require('./defaults')

// create webpack config based on build config
module.exports = (buildConfig, otherOptions) => {
  if (!webpackOptionsValidator(otherOptions)) {
    process.exit(1)
  }

  const paths = resolveWebpackPath(otherOptions.paths)
  const packageJson = requireGivenModule(paths.packagePath)

  const createdStyleLoader = require.resolve('style-loader')
  const createdCssLoader = {
    loader: require.resolve(otherOptions.cssLoaderName || 'css-loader'),
    options: {
      importLoaders: true,
    },
  }

  const createdPostcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: otherOptions.postcssOptions || initPostcssOptions(paths.documentRoot),
  }
  const createExtractCssPlugin = (resolveUse) => ExtractTextPlugin.extract({
    use: resolveUse,
    fallback: createdStyleLoader,
  })
  const webpackConfig = merge(buildConfig, {
    target: 'web',
    context: paths.documentRoot,
    output: {
      filename: '[name].js',
      chunkFilename: 'resources/[name][hash].js',
      path: paths.buildPath,
      publicPath: paths.publicPath,
    },
    resolve: {
      alias: {
        '@': paths.userSrcPath,
      },
      extensions: ['.js', '.jsx', '.json', '.vue', '.ts'],
      mainFiles: ['index'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve('babel-loader'),
          exclude: [/(node_modules|bower_components)/, paths.buildPath],
          include: paths.userSrcPath,
          options: otherOptions.babelOptions || initBabelOptions(paths.documentRoot),
        },
        {
          test: /\.css$/,
          use: [
            createdStyleLoader,
            createdCssLoader,
            createdPostcssLoader,
          ],
        },
        {
          test: /\.(scss|sass)$/,
          use: createExtractCssPlugin([
            createdCssLoader,
            createdPostcssLoader,
            require.resolve(otherOptions.scssLoaderName || 'sass-loader'),
          ]),
        },
        {
          test: /\.less$/,
          use: createExtractCssPlugin([
            createdCssLoader,
            createdPostcssLoader,
            require.resolve('less-loader'),
          ]),
        },
        {
          test: /\.(html|tpl)$/,
          loader: require.resolve('html-loader'),
          options: {
            minimize: true,
            removeComments: true,
            collapseWhitespace: false,
          },
        },
        {
          test: /\.tsx?$/,
          loader: require.resolve(otherOptions.tsLoaderName || 'ts-loader'),
          exclude: [/(node_modules|bower_components)/, paths.buildPath],
          include: paths.userSrcPath,
          options: otherOptions.tsLoaderOptions || initTSOptions(paths.documentRoot),
        },
        {
          test: /\.twig$/,
          loader: require.resolve('twig-loader'),
          options: {
            autoescape: true,
          },
        },
        {
          test: /\.(gif|jpe?g|png|woff|svg|eot|otf|ttf)\??.*$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 8192,
            name: 'assets/[name][hash].[ext]',
            publicPath: '.',
          },
        },
      ],
    },
    node: {
      fs: 'empty',
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          VERSION: JSON.stringify(packageJson.version),
          TIMESTAMP: Date.now(),
        },
      }),
      new CaseSensitivePathsPlugin(),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false, // resolve conflict with `CopyWebpackPlugin`
      }),
      new ExtractTextPlugin({
        allChunks: true,
        filename: '[name].css',
        publicPath: '.',
      }),
      new ProgressBarPlugin(),
      new WriteFileWebpackPlugin(),
    ],

    devServer: {
      inline: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      disableHostCheck: true,
      stats: resolveStatsOptions(otherOptions.statsOptions, {
        colors: true,
      }),
    },
  })

  // devServer should be merged
  webpackConfig.devServer = merge(webpackConfig.devServer, {
    compress: true,
    before: (app, server) => {
      if (typeof otherOptions.middleware === 'function') {
        otherOptions.middleware(app, server)
      }
    },
  })
  if (otherOptions.isDevelopment) {
    webpackConfig.devtool = 'cheap-module-source-map'
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new WarningsToErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])

    if (otherOptions.liveReloadOptions && typeof otherOptions.liveReloadOptions === 'object') {
      webpackConfig.plugins.push(
        new WebpackLiveReloadPlugin(otherOptions.liveReloadOptions)
      )
    }
  } else {
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        compress: {
          warnings: false,
        },
        mangle: {
          except: ['exports', 'require'],
        },
        output: {
          ascii_only: true // eslint-disable-line
        },
      }),
    ])
  }

  // Webpack modules public path
  if (typeof otherOptions.runtimePublicPath === 'string') {
    webpackConfig.plugins.push(
      new RuntimePublicPathPlugin({
        runtimePublicPath: otherOptions.runtimePublicPath,
      })
    )
  }

  // Copy files and directories with webpack
  if (otherOptions.copyOptions) {
    webpackConfig.plugins.push(new CopyWebpackPlugin(otherOptions.copyOptions))
  }

  if (otherOptions.commonChunks) {
    if (Array.isArray(otherOptions.commonChunks)) {
      otherOptions.commonChunks.forEach((item) => {
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(item))
      })
    } else if (typeof otherOptions.commonChunks === 'object') {
      webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(otherOptions.commonChunks))
    }
  }

  // generate a JSON file with output manifests
  if (otherOptions.assetsManifestOptions && typeof otherOptions.assetsManifestOptions === 'object') {
    const defaultAssetsManifestOptions = {
      writeToDisk: true,
    }

    webpackConfig.plugins.push(
      new WebpackAssetsManifest({
        ...defaultAssetsManifestOptions,
        ...otherOptions.assetsManifestOptions,
      })
    )
  }

  return webpackConfig
}
