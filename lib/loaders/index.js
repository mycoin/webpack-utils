const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getBabelOption = require('./babels')
const getPostcssOption = require('./postcss')

const requireResolve = (moduleName) => require.resolve(moduleName)
const excludePaths = [
  /(node_modules|bower_components)/,
]

const testMapper = {
  javascript: /\.jsx?$/,
  sass: /\.(scss|sass)$/,
}

module.exports = (option) => {
  const { documentRoot, isDevelopment, extractCSS } = option
  const createdPostcssLoader = {
    loader: requireResolve('postcss-loader'),
    options: getPostcssOption(documentRoot),
  }

  const createdBabelLoader = requireResolve('babel-loader')
  const createdStyleLoader = requireResolve('style-loader')
  const createdCssLoader = {
    loader: requireResolve('css-loader'),
    options: {
      importLoaders: 1,
      sourceMap: isDevelopment,
    },
  }

  const createWithExtraLoader = (extraLoader) => {
    const returnLoaders = [
      extractCSS ? MiniCssExtractPlugin.loader : createdStyleLoader,
      createdCssLoader,
    ]
    // postcss
    if (createdPostcssLoader.options) {
      returnLoaders.push(createdPostcssLoader)
    }
    if (extraLoader) {
      returnLoaders.push(extraLoader)
    }
    return returnLoaders
  }

  return [
    {
      test: testMapper.javascript,
      exclude: excludePaths,
      use: {
        loader: createdBabelLoader,
        options: getBabelOption(documentRoot),
      },
    },
    {
      test: testMapper.sass,
      use: createWithExtraLoader({
        loader: requireResolve('sass-loader'),
        options: {
          sourceMap: isDevelopment,
        },
      }),
    },
  ]
}
