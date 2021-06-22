const { webpackFactory, WebpackExecutor } = require('../..')

const option = {
  extractCSS: true,
  mode: 'production',
  // mode: 'development',
}

const builder = webpackFactory(option)

builder.devServer({
  port: 8000,
})

const webpackConfig = builder.doExport()
const executor = new WebpackExecutor(webpackConfig)

// executor.watch(webpackConfig.devServer)

executor.build((error, stats) => {
  console.log(stats.toString({
    colors: true,
    children: false,
  }))
})
