/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require, prefer-template */

const { webpackCoreFactory, webpackRun, utils } = require('../..')
const normalizer = require('./normalizer')

const { requireGivenModule } = utils
const buildConfig = requireGivenModule('build.config.js')

const { webpackConfig, webpackOptions } = normalizer(buildConfig, {
  nodeEnv: 'development',
  verbose: true,
})

// build ? or watch
webpackRun('watch', webpackCoreFactory(webpackConfig, webpackOptions), webpackOptions)
