/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path')
const { merge } = require('webpack-merge')

const defaultOption = {
  context: '.',
  mode: 'production',
  verbose: false,
  target: 'dist',
  extractCSS: true,
  publicPath: '/',
}

module.exports = (option) => {
  const options = merge(defaultOption, option || {})
  const chdir = (...paths) => {
    return path.resolve(options.context, ...paths)
  }

  const mergeOption = {
    isDevelopment: /development/.test(options.mode),
    chdir,
    documentRoot: chdir('.'),
    pkg: require(chdir('package.json')),
    outputPath: chdir(options.target),
  }

  return {
    ...options,
    ...mergeOption,
  }
}
