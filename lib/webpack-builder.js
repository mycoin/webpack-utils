/* eslint-disable global-require, prefer-template */

const webpack = require('webpack')
const emojiLog = require('console-emoji')
const WebpackDevServer = require('webpack-dev-server')

module.exports = (action, webpackConfig, otherOptions) => {
  if (typeof otherOptions.processWebpack === 'function') {
    otherOptions.processWebpack(webpackConfig, otherOptions, webpack)
  }

  const serverCompiler = webpack(webpackConfig)
  const onCallback = (error, stats) => {
    if (error || stats.hasErrors()) {
      process.exitCode = 1
    }
    emojiLog(stats.toString({
      all: !otherOptions.isDevelopment,
      colors: true,
      assets: true,
    }))

    if (typeof otherOptions.afterBuilt === 'function') {
      otherOptions.afterBuilt(stats, error)
    } else {
      emojiLog('\n')
      emojiLog(':star: build success', 'yellow')
    }
  }

  if (action === 'build') {
    serverCompiler.run(onCallback)
  } else if (action === 'watch') {
    const devServerOpt = webpackConfig.devServer
    const server = new WebpackDevServer(serverCompiler, devServerOpt)

    server.listen(devServerOpt.port, devServerOpt.host, () => {
      emojiLog(' :star: Starting server on http://' + devServerOpt.host + ':' + devServerOpt.port, 'yellow')
    })
  }
}
