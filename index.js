const webpack = require('webpack')

const createWebpack = require('./lib/createWebpack')
const loaderProxy = require('./lib/loaderProxy')
const normalizeOption = require('./lib/normalizeOption')
const webpackFactory = require('./lib/webpackFactory')
const WebpackExecutor = require('./lib/WebpackExecutor')

module.exports = {
  webpack,
  WebpackExecutor,
  webpackFactory,

  createWebpack,
  loaderProxy,
  normalizeOption,
}
