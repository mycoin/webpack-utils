const { webpackFactory, webpack } = require('../..')

const webpackConfig = webpackFactory({
  extractCSS: true,
})

const handler = (error, stats) => {
  console.log(stats.toString({
    colors: true,
  }))
}
const watchOption = {
  aggregateTimeout: 500,
}

webpack(webpackConfig).watch(watchOption, handler)
