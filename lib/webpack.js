/* eslint-disable global-require, prefer-template */

const webpack = require('webpack')
const merge = require('webpack-merge')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const LiveReloadPlugin = require('webpack-livereload-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const RuntimePublicPathPlugin = require('webpack-runtime-public-path-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const { initBabelOptions, extendIfNecessary, resolvePath } = require('./utils')
const postcssOptions = require('./postcss')

// create webpack config based on build config
module.exports = (buildConfig, otherOptions) => {
  const paths = extendIfNecessary(resolvePath(buildConfig.context), otherOptions.normalizedPaths)

  const createdStyleLoader = require.resolve('style-loader')
  const createdCssLoader = {
    loader: require.resolve(otherOptions.cssLoaderName || 'css-loader'),
    options: {
      importLoaders: true,
    },
  }
  const createdPostcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: otherOptions.postcssOptions || postcssOptions,
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
      extensions: ['.js', '.jsx', '.json', '.vue'],
      mainFiles: ['index'],
      alias: {
        '@': paths.userSrcPath,
      },
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
        },
        {
          test: /\.tsx?$/,
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
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
            name: 'assets/[hash].[ext]',
            publicPath: '.',
          },
        },
      ],
    },
    node: {
      fs: 'empty',
    },
    stats: 'errors-only',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),

      new CaseSensitivePathsPlugin(),
      new CleanWebpackPlugin(),
      new ExtractTextPlugin({
        allChunks: true,
        filename: '[name].css',
        publicPath: '.',
      }),
      new ProgressBarPlugin(),
      new WriteFileWebpackPlugin(),
    ],
  })

  if (otherOptions.isDevelopment) {
    webpackConfig.devtool = 'cheap-module-source-map'
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])

    const devServerOpt = {
      inline: true,
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      stats: {
        colors: true,
        assets: true,
      },
    }

    webpackConfig.devServer = {
      ...devServerOpt,
      ...buildConfig.devServer,
      compress: true,
      before: (app) => {
        if (typeof otherOptions.middleware === 'function') {
          otherOptions.middleware(app)
        }
      },
    }
    if (otherOptions.liveReloadOptions && typeof otherOptions.liveReloadOptions === 'object') {
      webpackConfig.plugins.push(
        new LiveReloadPlugin(otherOptions.liveReloadOptions)
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
