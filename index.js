const webpack = require('webpack')

const webpackCoreFactory = require('./lib/webpack')
const webpackRun = require('./lib/webpack-builder')
const utils = require('./lib/utils')
const defaults = require('./lib/defaults')

module.exports = {
  webpack,
  webpackCoreFactory,
  webpackRun,

  utils,
  defaults,
}
