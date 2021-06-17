const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')
const initLoaders = require('./loaders')
const { createTerserPlugin } = require('./plugins')

const defaultOption = {
  context: '.',
  mode: 'production',
  extractCSS: true,
}

module.exports = (option) => {
  const options = merge(defaultOption, option)
  const normalizePath = (...pathName) => {
    return path.resolve(options.context, ...pathName)
  }

  Object.assign(options, {
    isDevelopment: /development/i.test(options.mode),
    documentRoot: normalizePath(),
    output: normalizePath('dist'),
  })

  return {
    entry: options.entry || '@/index',
    target: 'web',
    mode: options.mode,
    context: options.documentRoot,
    externals: [],
    resolve: {
      alias: {
        '@': normalizePath('src'),
      },
    },
    module: {
      rules: initLoaders(options, {
        babel: true,
      }),
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 8 * 1024 * 1024,
      maxEntrypointSize: 8 * 1024 * 1024,
    },
    optimization: {
      minimize: /production/.test(options.mode),
      minimizer: [
        createTerserPlugin(options),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(process.env.VERSION || ''),
        },
      }),
    ],
    output: {
      path: options.output,
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
