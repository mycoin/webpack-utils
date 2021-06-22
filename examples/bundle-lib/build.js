const { webpackFactory, WebpackExecutor } = require('../..')

const option = {
  extractCSS: true,
  mode: 'production',
  // mode: 'development',
}

const webpackConfig = webpackFactory(option, (chain) => {
  chain.devServer({
    port: 8000,
  })
})

const executor = new WebpackExecutor(webpackConfig)

// executor.watch(webpackConfig.devServer)

executor.build((error, stats) => {
  console.log(stats.toString({
    colors: true,
    children: false,
  }))
})
