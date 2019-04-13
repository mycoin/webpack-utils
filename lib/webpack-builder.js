/* eslint-disable global-require, prefer-template */

const webpack = require('webpack')
const emojiLog = require('console-emoji')
const WebpackDevServer = require('webpack-dev-server')

module.exports = (action, webpackConfig, otherOptions) => {
  if (typeof otherOptions.processWebpack === 'function') {
    otherOptions.processWebpack(webpackConfig, otherOptions, webpack)
  }

  const serverCompiler = webpack(webpackConfig)
  const { devServer } = webpackConfig
  const onCallback = (error, stats) => {
    if (error || stats.hasErrors()) {
      process.exitCode = 1
    }

    if (typeof otherOptions.afterBuilt === 'function') {
      otherOptions.afterBuilt(stats, error)
    } else {
      emojiLog(stats.toString(devServer.stats) + '\n')
      emojiLog(' Build success. ', 'ok')
    }
  }

  if (action === 'build') {
    serverCompiler.run(onCallback)
  } else if (action === 'watch') {
    const server = new WebpackDevServer(serverCompiler, devServer)

    server.listen(devServer.port, devServer.host, () => {
      emojiLog('\t:fire: Starting server on http://' + devServer.host + ':' + devServer.port, 'red')
    })
  }
}
