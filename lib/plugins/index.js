const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const RuntimePublicPathPlugin = require('./RuntimePublicPathPlugin')
const WarningsToErrorsPlugin = require('./WarningsToErrorsPlugin')
const createTerserPlugin = require('./createTerserPlugin')

module.exports = {
  CssMinimizerWebpackPlugin,
  RuntimePublicPathPlugin,
  WarningsToErrorsPlugin,
  createTerserPlugin,
}
