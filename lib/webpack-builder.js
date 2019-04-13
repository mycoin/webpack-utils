/* eslint-disable global-require, prefer-template */

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const consoleLog = (log) => console.log(log) // eslint-disable-line

module.exports = (actionName, webpackConfig, otherOptions) => {
  if (typeof otherOptions.processWebpack === 'function') {
    otherOptions.processWebpack(webpackConfig, otherOptions, webpack)
  }

  const serverCompiler = webpack(webpackConfig)
  const { devServer } = webpackConfig
  const callbackContext = {
    webpackConfig,
    compiler: serverCompiler,
  }

  if (actionName === 'build') {
    serverCompiler.run((error, stats) => {
      if (error || stats.hasErrors()) {
        process.exitCode = 1
      }
      if (typeof otherOptions.afterBuilt === 'function') {
        otherOptions.afterBuilt(stats, error, callbackContext)
      } else {
        consoleLog(stats.toString(devServer.stats) + '\n')
        consoleLog(' Build success. ', 'ok')
      }
    })
  } else if (actionName === 'watch') {
    const server = new WebpackDevServer(serverCompiler, devServer)
    const afterListen = () => {
      consoleLog(' Starting server on http://' + devServer.host + ':' + devServer.port)
      if (typeof otherOptions.afterWatched === 'function') {
        otherOptions.afterWatched(server, devServer, callbackContext)
      }
    }

    server.listen(devServer.port, devServer.host, afterListen)
  }
}
