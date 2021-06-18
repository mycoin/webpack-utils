const webpack = require('webpack')
const { merge } = require('webpack-merge')

const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SimpleProgressBarPlugin = require('simple-progress-webpack-plugin')

const createLoaderProxy = require('./createLoaderProxy')
const createDefaults = require('./createDefaults')

const normalizeOption = require('./internal/normalizeOption')
const { createBefore } = require('./internal/devServer')
const WarningsToErrorsPlugin = require('./plugins/WarningsToErrorsPlugin')
const createTerserPlugin = require('./plugins/createTerserPlugin')
const { loaderWhen, createHandler, requireResolve } = require('./util')

module.exports = (option) => {
  const options = normalizeOption(option)
  const loader = createLoaderProxy(options, (fieldName) => ({
    loader: requireResolve(fieldName + '-loader'),
    options: {},
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

  const defaultTemplate = createDefaults(options)
  const webpackConfig = merge(defaultTemplate, {
    entry: options.entry,
    module: {
      rules: [
        loaderWhen('javascript', loader.babel),
        loaderWhen('css', handlerCSS()),
        loaderWhen('sass', handlerCSS(loader.sass)),
        loaderWhen('less', handlerCSS(loader.less)),
        loaderWhen('ejs', [
          loader.babel,
          loader.ejs,
        ]),
      ],
    },
    devServer: {
      before: createBefore(options),
    },
    output: {
      path: options.target,
      publicPath: options.publicPath,
      filename: '[name].js',
    },
  })

  const handler = createHandler(webpackConfig, options)

  handler.addPlugin([
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
    handler.addPlugin([
      new WarningsToErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])
  } else {
    handler.addPlugin([
      new CssMinimizerWebpackPlugin(),
    ])
    webpackConfig.optimization.minimizer.push(
      createTerserPlugin(),
    )
  }

  return handler
}
