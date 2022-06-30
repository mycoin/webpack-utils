/* eslint-disable max-len */
/* eslint-disable global-require, prefer-template */
import webpack from 'webpack'
import { merge } from 'webpack-merge'

import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import SimpleProgressBarPlugin from 'simple-progress-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'

import WriteFileWebpackPlugin from 'write-file-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import RuntimePublicPathPlugin from './plugins/RuntimePublicPathPlugin'
import WarningsToErrorsPlugin from './plugins/WarningsToErrorsPlugin'

import {
  getBabelOption,
  getLessOption,
  getPostcssOption,
  getTsOption,
  createWebpackCopy,
} from './presets'

const requireResolve = (moduleName) => require.resolve(moduleName)
const normalizeWebpackEntry = (option, paths) => {
  const defaultMap = {}
  if (option && typeof option === 'object') {
    return option
  }
  if (option && !/^[@.]/.test(option)) {
    defaultMap.index = paths.resolvePath(option)
  } else if (option) {
    defaultMap.index = option
  } else {
    defaultMap.index = '@/index'
  }

  return defaultMap
}

// create webpack config based on build config
export default (builderOption, otherOptions) => {
  const { extractCSS, paths } = otherOptions
  const sourceMap = Boolean(otherOptions.sourceMap || otherOptions.isDevelopment)
  const createdStyleLoader = {
    loader: requireResolve('style-loader'),
    options: {
      attributes: {
        type: 'text/css',
      },
    },
  }
  const createdBabelLoader = {
    loader: requireResolve('babel-loader'),
    options: getBabelOption(paths.documentRoot),
  }
  const createdPostcssLoader = {
    loader: requireResolve('postcss-loader'),
    options: getPostcssOption(paths.documentRoot),
  }
  const createdEjsLoader = {
    loader: requireResolve('../supports/ejsLoader'),
    options: {
      // IMPORTANT, DONOT TOUCH !!!
      variable: 'data,option',
      esModule: true,
    },
  }

  const createdCssLoader = {
    loader: requireResolve('css-loader'),
    options: {
      importLoaders: 1,
      sourceMap,
    },
  }

  const createWithExtraLoader = (extraLoader) => {
    const returnLoaders = [
      extractCSS ? MiniCssExtractPlugin.loader : createdStyleLoader,
      createdCssLoader,
    ]
    if (createdPostcssLoader.options) {
      returnLoaders.push(createdPostcssLoader)
    }
    if (extraLoader) {
      returnLoaders.push(extraLoader)
    }
    return returnLoaders
  }

  const webpackConfig = merge(builderOption, {
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: createdBabelLoader,
        },
        {
          test: /\.css$/,
          use: createWithExtraLoader(),
        },
        {
          test: /iview.src.*?js$/,
          use: createdBabelLoader,
        },
        {
          test: /\.vue$/,
          loader: requireResolve('vue-loader'),
        },
        {
          test: /\.(scss|sass)$/,
          use: createWithExtraLoader({
            loader: requireResolve('sass-loader'),
            options: {
              sourceMap,
            },
          }),
        },
        {
          test: /\.less$/,
          use: createWithExtraLoader({
            loader: requireResolve('less-loader'),
            options: getLessOption(paths.documentRoot, otherOptions),
          }),
        },
        {
          test: /\.(tpl)$/,
          loader: requireResolve('raw-loader'),
          options: {
            esModule: false,
          },
        },
        {
          test: /\.(html)$/,
          loader: requireResolve('html-loader'),
          options: {
            minimize: true,
          },
        },
        {
          test: /\.tsx?$/,
          loader: requireResolve('ts-loader'),
          options: getTsOption(paths.documentRoot),
        },
        {
          test: /\.ejs$/,
          use: [
            createdBabelLoader,
            createdEjsLoader,
          ],
        },
        extractCSS ? {
          test: /\.(gif|jpe?g|png|woff|svg|eot|otf|ttf)\??.*$/,
          loader: requireResolve('url-loader'),
          type: 'javascript/auto',
          options: {
            limit: 8192,
            name: 'resources/[hash].[ext][query]',
            esModule: false,
          },
        } : {
          test: /\.(gif|jpe?g|png|woff|svg|eot|otf|ttf)\??.*$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8192,
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NPM_NAME: JSON.stringify(process.env.TAKLA_NPM_NAME),
          PUBLIC_PATH: JSON.stringify(process.env.TAKLA_PUBLIC_PATH),
          TIMESTAMP: JSON.stringify(process.env.TAKLA_TIMESTAMP),
          VERSION: JSON.stringify(process.env.TAKLA_VERSION),
        },
      }),
      new SimpleProgressBarPlugin({
        format: otherOptions.isVerbose ? 'verbose' : 'compact',
      }),
      new CaseSensitivePathsPlugin(),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false, // resolve conflict with `CopyWebpackPlugin`
      }),

      // vue loader
      new VueLoaderPlugin(),
      new WriteFileWebpackPlugin(),
    ],
    optimization: {
      minimize: !otherOptions.isDevelopment,
    },
    devServer: {
      inline: true,
      hot: true,
      disableHostCheck: true,
      stats: {
        colors: true,
        chunks: false,
      },
    },
  })
  if (extractCSS) {
    webpackConfig.plugins.push(new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'chunks/[name]-[hash].css',
    }))
  }

  if (otherOptions.webpackCopy) {
    webpackConfig.plugins.push(createWebpackCopy(otherOptions.webpackCopy, otherOptions))
  }

  // devServer should be merged
  webpackConfig.entry = normalizeWebpackEntry(webpackConfig.entry, paths)
  webpackConfig.devServer = merge(webpackConfig.devServer, {
    compress: true,
    before: (app, server) => {
      if (typeof otherOptions.devServerMiddleware === 'function') {
        otherOptions.devServerMiddleware(app, server)
      }
      app.use((req, res, next) => {
        res.setHeader('X-Document-Root', paths.documentRoot)
        next()
      })
      app.use(require('nocache')())
      app.use(require('cors')())
      app.use(require('combo-handler')({
        base: paths.documentRoot,
      }))
    },
  })

  if (otherOptions.isDevelopment) {
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new WarningsToErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])
  } else {
    webpackConfig.optimization.minimizer.push(new TerserWebpackPlugin({
      parallel: true,
      extractComments: false,
      terserOptions: {
        ecma: 2015,
        ie8: true,
        safari10: true,
        mangle: {
          reserved: ['define', 'require', 'module', 'exports'],
        },
        output: {
          beautify: false,
          comments: false,
          ascii_only: true,
        },
      },
    }))
  }

  // Webpack modules public path
  if (paths.runtimePublicPath && typeof paths.runtimePublicPath === 'string') {
    webpackConfig.plugins.push(
      new RuntimePublicPathPlugin({
        runtimePath: paths.runtimePublicPath,
      }),
    )
  }
  return webpackConfig
}
