/* eslint-disable global-require, prefer-template */
import webpack from 'webpack'
import lsofi from 'lsofi'
import chalk from 'chalk'

import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'
import webpackCoreFactory from '../webpack'
import logger from '../logger'
import { getToStringOption } from '../utils'

export default (builderOption, otherOptions) => {
  const webpackConfig = webpackCoreFactory(builderOption, otherOptions)
  const serverCompiler = webpack(webpackConfig)
  const statsOptions = getToStringOption(otherOptions)
  const { devServer } = webpackConfig

  if (devServer.useWebpackWatch) {
    const watchOption = {
      aggregateTimeout: 500,
    }
    serverCompiler.watch(watchOption, (error, stats) => {
      if (stats) {
        logger.raw(stats.toString(statsOptions))
        logger.raw()
      }
      if (error || stats.hasErrors()) {
        logger.error('BUILD FAILED, BUT STILL WATCHING !')
      } else {
        logger.info('STILL WATCHING ...')
      }
    })
  } else {
    const startWatch = () => {
      const watchDevServer = merge(devServer, {
        disableHostCheck: true,
        clientLogLevel: 'warning',
        stats: statsOptions,
      })
      new WebpackDevServer(serverCompiler, watchDevServer).listen(devServer.port, devServer.host)
    }
    lsofi(devServer.port).then((pid) => {
      if (pid === null) {
        startWatch()
      } else if (process.kill(pid, 'SIGKILL')) {
        startWatch()
      } else {
        throw new Error('process kill failed! execute' + chalk.bgBlueBright.white('kill -9 ' + pid))
      }
    })
  }
}
