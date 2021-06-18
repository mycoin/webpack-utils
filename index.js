const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackFactory = require('./lib/webpackFactory')
const loaderProxy = require('./lib/loaderProxy')
const createWebpackConfig = require('./lib/createWebpackConfig')

module.exports = {
  createWebpackConfig,
  WebpackDevServer,
  webpack,
  loaderProxy,
  webpackFactory,
}
