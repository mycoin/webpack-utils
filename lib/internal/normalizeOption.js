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
  const chdir = (...paths) => {
    return path.resolve(options.context, ...paths)
  }

  Object.assign(options, {
    developmentMode: /development/.test(option.mode),
    chdir,
    documentRoot: chdir('.'),
    target: chdir(options.target),
  })

  return options
}
