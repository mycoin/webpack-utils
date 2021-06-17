const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { default: merge } = require('_webpack-merge@5.8.0@webpack-merge')
const loaderFactory = require('./loaderFactory')
const normalizeOption = require('./internal/normalizeOption')
const defaults = require('./internal/defaults')
const { handlerWhen } = require('./util')

const {
  OptimizeCssAssetsPlugin,
  WarningsToErrorsPlugin,
  createTerserPlugin } = require('./plugins')

module.exports = (option) => {
  const options = normalizeOption(option)
  const loader = loaderFactory(options)

  const handlerCSS = (headConvert) => {
    const results = [
      loader.style,
      loader.css,
      loader.postcss,
      headConvert,
    ]
    return results.filter(Boolean)
  }

  const webpackConfig = merge(defaults(options), {
    entry: options.entry,
    mode: options.mode,
    context: options.documentRoot,
    module: {
      rules: [
        handlerWhen('javascript', loader.babel),
        handlerWhen('css', handlerCSS()),
        handlerWhen('sass', handlerCSS(loader.sass)),
        handlerWhen('less', handlerCSS(loader.less)),
        handlerWhen('ejs', [
          loader.babel,
          loader.ejs,
        ]),
      ],
    },
    devtool: 'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(process.env.VERSION || ''),
        },
      }),
    ],
    output: {
      path: options.target,
      filename: '[name].js',
    },
  })

  if (options.developmentMode) {
    webpackConfig.devtool = 'cheap-module-source-map'
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new WarningsToErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ])
  } else {
    webpackConfig.optimization.minimizer.push(
      createTerserPlugin(),
    )
    webpackConfig.plugins.push(new OptimizeCssAssetsPlugin())
  }

  return webpackConfig
}
