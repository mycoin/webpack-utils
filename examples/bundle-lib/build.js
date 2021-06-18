const { webpackFactory } = require('../..')

const fac = webpackFactory({
  extractCSS: true,
  // mode: 'development',
  mode: 'production',
})

const compiler = fac.build()
const handler = (error, stats) => {
  console.log(stats.toString({
    colors: true,
    children: false,
  }))
}

const watchOption = {
  aggregateTimeout: 500,
}

// compiler.watch(watchOption, handler)
compiler.run(handler)

// new WebpackDevServer(compiler, webpackConfig.devServer).listen(8000)
