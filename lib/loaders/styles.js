const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getPostcssOption = require('./postcss')

const requireResolve = (moduleName) => require.resolve(moduleName)

module.exports = (options) => {
  const { isDevelopment, extractCSS, documentRoot } = options
  const styleLoader = requireResolve('style-loader')
  const cssLoader = {
    loader: requireResolve('css-loader'),
    options: {
      importLoaders: 1,
      sourceMap: isDevelopment,
    },
  }

  const postcssLoader = {
    loader: requireResolve('postcss-loader'),
    options: getPostcssOption(documentRoot),
  }

  const appendLoader = (extraLoader) => {
    const returnLoaders = [
      extractCSS ? MiniCssExtractPlugin.loader : styleLoader,
      cssLoader,
    ]
    if (postcssLoader.options) {
      returnLoaders.push(postcssLoader)
    }
    if (extraLoader) {
      returnLoaders.push(extraLoader)
    }
    return returnLoaders
  }

  return {
    cssLoader,
    appendLoader,
  }
}
