/* eslint-disable global-require, import/no-dynamic-require */
const { defaults, utils } = require('../..')

const { resolvePath, extendIfNecessary } = utils
const { defaultWebpackConfig, defaultWebpackOptions } = defaults
const initDevServer = (listenOpt) => {
  const defaultDevServerOpt = {
    host: '127.0.0.1',
    port: 4444,
    stats: {
      colors: true,
    },
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

module.exports = (buildConfig, options) => {
  const webpackOptions = extendIfNecessary(defaultWebpackOptions, buildConfig)
  const resolvedPaths = resolvePath(webpackOptions.context)
  const webpackConfig = extendIfNecessary(defaultWebpackConfig(resolvedPaths), buildConfig.webpack)

  if (!defaultWebpackOptions.normalizedPaths) {
    webpackOptions.normalizedPaths = resolvedPaths
  }

  // isDevelopment
  if (options.nodeEnv === 'development') {
    webpackOptions.isDevelopment = true
  } else if (options.nodeEnv === 'production') {
    webpackOptions.isDevelopment = false
  }

  // init DevServer if development
  if (webpackOptions.isDevelopment) {
    webpackConfig.devServer = initDevServer(buildConfig.listen)
    if (typeof buildConfig.liveReloadOptions === 'number' && buildConfig.liveReloadOptions > 0) {
      webpackOptions.liveReloadOptions = {
        port: buildConfig.liveReloadOptions,
      }
    }
  } else {
    webpackOptions.isProduction = true
  }

  // 其它额外配置项
  if (buildConfig.optimize) {
    webpackOptions.optimizeActived = true
    webpackOptions.cssLoaderName = 'fast-css-loader'
    webpackOptions.scssLoaderName = 'fast-sass-loader'
  }

  return {
    webpackConfig,
    webpackOptions,
  }
}
