const webpack = require('webpack')

const SimpleProgressBarPlugin = require('simple-progress-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const WarningsToErrorsPlugin = require('./plugins/WarningsToErrorsPlugin')

const WebpackChain = require('./WebpackChain')
const create = require('./internals/create')
const normalizeOption = require('./internals/normalizeOption')
const { createSetup } = require('./internals/devServer')
const loaderProxy = require('./loaderProxy')

const {
  requireResolve,
  getUniqueName,
  getTerserOptions } = require('./util')

module.exports = (option, ready) => {
  const options = normalizeOption(option)
  const webpackConfig = create(options, {
    entry: options.entry,
    devServer: {
      setup: createSetup(options),
    },
    output: {
      path: options.outputPath,
      publicPath: options.publicPath,
      filename: '[name].js',
      uniqueName: getUniqueName(options.pkg),
    },
  })

  const webpackChain = new WebpackChain(webpackConfig)
  const loader = loaderProxy(options, (loaderName) => ({
    loader: requireResolve(loaderName),
  }))

  const handlerCSS = (headConvert) => {
    const results = [
      loader.style,
      loader.css,
      loader.postcss,
    ]
    if (headConvert) {
      results.push(headConvert)
    }
    return results.filter(Boolean)
  }

  webpackChain.loaderWhen('javascript', loader.babel)
  webpackChain.loaderWhen('css', handlerCSS())
  webpackChain.loaderWhen('sass', handlerCSS(loader.sass))
  webpackChain.loaderWhen('less', handlerCSS(loader.less))
  webpackChain.loaderWhen('ejs', [
    loader.babel,
    loader.ejs,
  ])

  webpackChain.registerPlugin([
    new SimpleProgressBarPlugin({
      format: options.verbose ? 'verbose' : 'compact',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION || ''),
      },
    }),
  ])

  if (options.extractCSS) {
    webpackChain.registerPlugin(new MiniCssExtractPlugin())
  }

  if (options.isDevelopment) {
    webpackChain.registerPlugin([
      new WarningsToErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])
  } else {
    webpackChain.registerPlugin([
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: getTerserOptions(),
      }),
    ])
  }

  // hookout
  const executeHook = typeof option === 'function'
    ? option
    : ready

  if (typeof executeHook === 'function') {
    executeHook(webpackChain, options)
  }
  return webpackChain.extract()
}
