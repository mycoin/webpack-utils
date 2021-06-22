const webpack = require('webpack')

const loaderProxy = require('./lib/loaderProxy')
const webpackFactory = require('./lib/webpackFactory')
const WebpackExecutor = require('./lib/WebpackExecutor')

module.exports = {
  webpack,
  WebpackExecutor,
  webpackFactory,

  loaderProxy,
}
