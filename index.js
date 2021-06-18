const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackFactory = require('./lib/webpackFactory')
const createLoaderProxy = require('./lib/createLoaderProxy')

module.exports = {
  WebpackDevServer,
  webpack,
  createLoaderProxy,
  webpackFactory,
}
