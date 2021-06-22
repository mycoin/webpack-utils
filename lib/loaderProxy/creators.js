const path = require('path')
const fs = require('fs-extra')
const { cosmiconfigSync } = require('cosmiconfig')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LessPluginFunctions = require('less-plugin-functions')
const nodeSass = require('sass')

const { requireResolve } = require('../util')

exports.babel = (option) => {
  const babelOption = {
    babelrc: false,
    cacheDirectory: true,
  }

  if (fs.existsSync(path.join(option.documentRoot, '.babelrc'))) {
    babelOption.babelrc = true
  }
  return {
    loader: requireResolve('babel-loader'),
    options: babelOption,
  }
}

exports.style = (option) => {
  if (option.extractCSS) {
    return MiniCssExtractPlugin.loader
  }
  return requireResolve('style-loader')
}

exports.sass = (option) => ({
  loader: requireResolve('sass-loader'),
  options: {
    sourceMap: option.isDevelopment,
    implementation: nodeSass,
  },
})

exports.less = (option) => {
  const result = cosmiconfigSync('less').search(option.documentRoot)
  const mainTsOptions = {
    sourceMap: option.isDevelopment,
    lessOptions: {},
  }

  if (result && result.config) {
    mainTsOptions.lessOptions = result.config
  } else {
    mainTsOptions.lessOptions = {
      plugins: [
        new LessPluginFunctions(),
      ],
    }
  }
  return {
    loader: requireResolve('less-loader'),
    options: mainTsOptions,
  }
}

exports.ejs = () => ({
  loader: path.join(__dirname, 'ejs'),
  options: {
    esModule: true,
    variable: 'data,option',
  },
})

exports.css = (option) => ({
  loader: requireResolve('css-loader'),
  options: {
    sourceMap: option.isDevelopment,
    importLoaders: 1,
  },
})

exports.postcss = (option) => {
  const explorerSync = cosmiconfigSync('postcss')
  const result = explorerSync.search(option.documentRoot) || {}
  if (result.config) {
    return {
      loader: requireResolve('postcss-loader'),
      options: result.config,
    }
  }
  return null
}
