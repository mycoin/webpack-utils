const { webpackFactory, webpack } = require('../..')

const webpackConfig = webpackFactory({
  extractCSS: false,
})

webpack(webpackConfig).run((error, stats) => {
  console.log(stats.toString({
    colors: true,
  }))
})
