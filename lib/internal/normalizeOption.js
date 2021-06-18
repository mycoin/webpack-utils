const path = require('path')
const { merge } = require('webpack-merge')

const defaultOption = {
  context: '.',
  mode: process.env.NODE_ENV || 'production',
  target: 'dist',
  extractCSS: true,
  publicPath: '/',
}

module.exports = (option) => {
  const options = merge(defaultOption, option)
  const resolvePath = (...paths) => {
    return path.resolve(options.context, ...paths)
  }
  Object.assign(options, {
    isDevelopment: /development/.test(option.mode),
    resolvePath,
    documentRoot: resolvePath('.'),
    target: resolvePath(options.target),
  })
  return options
}
