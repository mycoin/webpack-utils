const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const createTerserPlugin = require('./createTerserPlugin')
const RuntimePublicPathPlugin = require('./RuntimePublicPathPlugin')
const WarningsToErrorsPlugin = require('./WarningsToErrorsPlugin')

module.exports = {
  createTerserPlugin,
  OptimizeCssAssetsPlugin,
  RuntimePublicPathPlugin,
  WarningsToErrorsPlugin,
}
