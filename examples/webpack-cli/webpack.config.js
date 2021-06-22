const { webpackFactory } = require('../..')

module.exports = webpackFactory((webpackChain) => {
  webpackChain.entry({
    entry: '@/index',
  })
})
