const webpack = require('webpack')

const SimpleProgressBarPlugin = require('simple-progress-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const WarningsToErrorsPlugin = require('./plugins/WarningsToErrorsPlugin')

const WebpackChain = require('./WebpackChain')
const createWebpackConfig = require('./createWebpackConfig')
const loaderProxy = require('./loaderProxy')
const normalizeOption = require('./normalizeOption')
const { createSetup } = require('./devServer')

const { requireResolve, terserOptions } = require('./util')

module.exports = (option) => {
  const options = normalizeOption(option)
  const loader = loaderProxy(options, (loaderName) => ({
    loader: requireResolve(loaderName),
    options: {},
  }))
  const handlerCSS = (headConvert) => {
    const results = [
      loader.style,
      loader.css,
      loader.postcss,
      headConvert,
    ]
    return results.filter(Boolean)
  }

  const webpackConfig = createWebpackConfig(options, {
    entry: options.entry,
    devServer: {
      setup: createSetup(options),
    },
    output: {
      path: options.target,
      publicPath: options.publicPath,
      filename: '[name].js',
    },
  })

  const webpackChain = new WebpackChain(webpackConfig, options)

  webpackChain.loaderWhen('javascript', loader.babel)
  webpackChain.loaderWhen('css', handlerCSS())
  webpackChain.loaderWhen('sass', handlerCSS(loader.sass))
  webpackChain.loaderWhen('less', handlerCSS(loader.less))
  webpackChain.loaderWhen('ejs', [
    loader.babel,
    loader.ejs,
  ])

  webpackChain.registerPlugin([
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new SimpleProgressBarPlugin({
      format: options.verbose ? 'verbose' : 'compact',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION || ''),
      },
    }),
  ])

  if (options.isDevelopment) {
    webpackChain.registerPlugin([
      new WarningsToErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])
  } else {
    webpackChain.registerPlugin([
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin({
        terserOptions,
        extractComments: false,
      }),
    ])
  }

  return webpackChain
}
