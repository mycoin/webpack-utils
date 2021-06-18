const webpack = require('webpack')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const createLoaderProxy = require('./createLoaderProxy')
const normalizeOption = require('./internal/normalizeOption')
const createDefaults = require('./createDefaults')
const { createBefore } = require('./internal/devServer')
const { loaderWhen, createHandler, requireResolve } = require('./util')
const {
  CssMinimizerWebpackPlugin,
  WarningsToErrorsPlugin,
  createTerserPlugin } = require('./plugins')

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
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION || ''),
      },
    }),
  ])

  if (options.isDevelopment) {
    handler.addPlugin([
      new WarningsToErrorsPlugin(),
      webpack.HotModuleReplacementPlugin(),
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
