const path = require('path')
const { merge } = require('webpack-merge')

const defaultOption = {
  context: '.',
  mode: process.env.NODE_ENV || 'production',
  target: 'dist',
  extractCSS: true,
}

module.exports = (option) => {
  const options = merge(defaultOption, option)
  const normalizePath = (...paths) => {
    return path.resolve(options.context, ...paths)
  }

  Object.assign(options, {
    isDevelopment: /development/.test(option.mode),
    normalizePath,
    documentRoot: normalizePath(),
    target: normalizePath(options.target),
  })

  return options
}
