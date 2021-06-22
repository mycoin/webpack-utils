const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

module.exports = class WebpackExecutor {
  constructor(webpackConfig) {
    this.compiler = webpack(webpackConfig)

    if (Array.isArray(webpackConfig)) {
      this.isMutli = true
    } else {
      this.isMutli = false
    }
  }

  build(handler) {
    this.compiler.run((error, stats) => {
      if (error || stats.hasErrors()) {
        process.exitCode = 1
      }
      if (typeof handler === 'function') {
        handler(error, stats)
      }
    })
  }

  watch(devServer) {
    const watchOption = {
      aggregateTimeout: 500,
    }

    if (typeof devServer.port === 'number') {
      const webpackDevServer = new WebpackDevServer(this.compiler, devServer)
      webpackDevServer.listen(devServer.port)
    } else {
      this.compiler.watch(watchOption)
    }
  }
}
