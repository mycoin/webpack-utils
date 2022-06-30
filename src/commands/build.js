/* eslint-disable global-require, prefer-template */
import webpack from 'webpack'
import logger from '../logger'
import webpackConfigFactory from '../webpack'
import { getToStringOption } from '../utils'

export default (builderOption, otherOptions) => {
  const webpackConfig = webpackConfigFactory(builderOption, otherOptions)
  const serverCompiler = webpack(webpackConfig)

  serverCompiler.run((error, stats) => {
    if (error || stats.hasErrors()) {
      process.exitCode = 1
    }

    if (typeof otherOptions.webpackCallback === 'function') {
      otherOptions.webpackCallback(stats, error)
    } else {
      if (stats) {
        logger.raw(stats.toString(getToStringOption(otherOptions)))
        logger.raw()
      }
      if (process.exitCode) {
        logger.error('BUILD FAILED !')
      } else {
        logger.info()
        logger.info(otherOptions.packageJSON.name || '<empty>')
        logger.info(otherOptions.packageJSON.version || '<empty>')
        logger.info(otherOptions.paths.targetURL)
        logger.info()
        logger.info('BUILD SUCCESS !')
      }
    }
  })
}
