/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require, prefer-template */

const { webpack, webpackCoreFactory, webpackRun, utils } = require('../..')
const normalizer = require('./normalizer')

const { requireGivenModule } = utils
const actionNameAlias = {
  dev: 'watch',
  watch: 'watch',
  build: 'build',
  release: 'build',
}

const availableActions = Object.keys(actionNameAlias)

module.exports = (actionName, cliOptions) => {
  if (!actionNameAlias[actionName]) {
    throw new TypeError('Unknown action "' + actionName + '", available actions:  ' + availableActions.join(', '))
  }

  let buildConfig = requireGivenModule(cliOptions.config || 'build.config.js')
  if (typeof buildConfig === 'function') {
    const builtResult = buildConfig(webpack, cliOptions)
    if (builtResult && typeof builtResult === 'object') {
      buildConfig = builtResult
    }
  }

  const { webpackConfig, webpackOptions } = normalizer(buildConfig, cliOptions)
  const webpackConf = webpackCoreFactory(webpackConfig, webpackOptions)

  webpackRun(actionNameAlias[actionName], webpackConf, webpackOptions)
}
