/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path')
const { merge } = require('webpack-merge')

const defaultOption = {
  context: '.',
  mode: process.env.NODE_ENV || 'production',
  verbose: false,
  target: 'dist',
  extractCSS: true,
  publicPath: '/',
}

module.exports = (option) => {
  const options = merge(defaultOption, option)
  const resolvePath = (...paths) => {
    return path.resolve(options.context, ...paths)
  }

  const mergeOption = {
    isDevelopment: /development/.test(option.mode),
    resolvePath,
    documentRoot: resolvePath('.'),
    pkg: require(resolvePath('package.json')),
    target: resolvePath(options.target),
  }

  return {
    ...options,
    ...mergeOption,
  }
}
