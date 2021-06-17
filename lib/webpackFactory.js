const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const loaderFactory = require('./loaderFactory')
const { createTerserPlugin } = require('./plugins')
const normalizeOption = require('./internal/normalizeOption')
const { handlerWhen } = require('./util')

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
  return {
    entry: options.entry,
    target: 'web',
    mode: options.mode,
    context: options.documentRoot,
    externals: [],
    resolve: {
      alias: {
        '@': options.normalizePath('src'),
      },
    },
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
    performance: {
      hints: 'warning',
      maxAssetSize: 8 * 1024 * 1024,
      maxEntrypointSize: 8 * 1024 * 1024,
    },
    optimization: {
      minimize: !options.isDevelopment,
      minimizer: [
        createTerserPlugin(),
      ],
    },
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
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        module: false,
      },
    },
  }
}
