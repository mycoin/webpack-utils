/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable global-require, import/no-dynamic-require */
const { defaults, utils } = require('../..')

const { resolvePath, extendIfNecessary } = utils
const { defaultWebpackConfig, defaultWebpackOptions } = defaults

const initDevServer = (listenOpt) => {
  const defaultDevServerOpt = {
    host: '127.0.0.1',
    port: 4444,
  }

  if (listenOpt && typeof listenOpt === 'object') {
    return extendIfNecessary(defaultDevServerOpt, listenOpt)
  } if (typeof listenOpt === 'string') {
    const split = listenOpt.split(':')

    return extendIfNecessary(defaultDevServerOpt, {
      host: split[0],
      port: Number(split[1]) || defaultDevServerOpt.port,
    })
  }
  return defaultDevServerOpt
}

const buildConfigValidator = (provideredConfig) => {
  const provideredOptionNames = Object.keys(provideredConfig)
  const validOptionKeyNames = Object.keys(defaultWebpackOptions).concat([
    'webpack',
    'optimize',
    'listen',
  ])

  for (let index = 0; index < provideredOptionNames.length; index++) {
    const fieldItem = provideredOptionNames[index]
    if (validOptionKeyNames.indexOf(fieldItem) === -1) { // eslint-disable-line
      throw new TypeError(
        'webpackOptions has an unknown field "' + fieldItem + '", '
        + 'valid properties are: '
        + validOptionKeyNames.join(', ')
      )
    }
  }
  return true
}

module.exports = (buildConfig, cliOptions) => {
  if (!buildConfigValidator(buildConfig)) {
    process.exit(1)
  }

  const webpackOptions = extendIfNecessary(defaultWebpackOptions, buildConfig)
  const resolvedPaths = resolvePath(webpackOptions.context)
  const webpackConfig = extendIfNecessary(defaultWebpackConfig(resolvedPaths), buildConfig.webpack)

  // paths that webpack needed
  webpackOptions.normalizedPaths = resolvedPaths
  webpackConfig.devServer = initDevServer(buildConfig.listen)

  // isDevelopment
  if (cliOptions.nodeEnv === 'development') {
    webpackOptions.isDevelopment = true
  } else if (cliOptions.nodeEnv === 'production') {
    webpackOptions.isDevelopment = false
  }

  // isProduction field
  webpackOptions.isProduction = !webpackOptions.isDevelopment

  // init DevServer if development
  if (webpackOptions.isDevelopment) {
    if (typeof buildConfig.liveReloadOptions === 'number' && buildConfig.liveReloadOptions > 0) {
      webpackOptions.liveReloadOptions = {
        port: buildConfig.liveReloadOptions,
      }
    }
  }

  // stats options
  if (!webpackOptions.statsOptions) {
    webpackOptions.statsOptions = cliOptions.verbose ? 'verbose' : 'normal'
  }

  // 其它额外配置项
  if (buildConfig.optimize) {
    webpackOptions.optimize = true
    webpackOptions.cssLoaderName = 'fast-css-loader'
    webpackOptions.scssLoaderName = 'fast-sass-loader'
  }

  return {
    webpackConfig,
    webpackOptions,
  }
}
