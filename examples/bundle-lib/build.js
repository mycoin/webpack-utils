const { webpackFactory, WebpackDevServer, webpack } = require('../..')

const fac = webpackFactory({
  extractCSS: true,
  mode: 'production',
})

const webpackConfig = fac.build()
const handler = (error, stats) => {
  console.log(stats.toString({
    colors: true,
    children: false,
  }))
}

const watchOption = {
  aggregateTimeout: 500,
}

const compiler = webpack(webpackConfig)

// compiler.watch(watchOption, handler)
// compiler.run(handler)

new WebpackDevServer(compiler, webpackConfig.devServer).listen(8000)
