const { webpackFactory, webpack } = require('../..')

const webpackConfig = webpackFactory({
  extractCSS: true,
  mode: 'development',
})

const handler = (error, stats) => {
  console.log(stats.toString({
    colors: true,
    children: true,
  }))
}
const watchOption = {
  aggregateTimeout: 500,
}

// webpack(webpackConfig).watch(watchOption, handler)
webpack(webpackConfig).run(handler)
