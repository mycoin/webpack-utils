/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')

/**
 *  `.babelrc`
 *
 * @param {String} documentRoot
 * @param {Function} externalRequire
 */
module.exports = (documentRoot, externalRequire) => {
  const interalRequire = externalRequire || require

  const babelRcPath = path.join(documentRoot, '.babelrc')
  const mainBabelOptions = {
    babelrc: false,
    cacheDirectory: true,
    compact: false,
  }

  if (fs.existsSync(babelRcPath)) {
    mainBabelOptions.babelrc = true
  } else {
    Object.assign(mainBabelOptions, {
      presets: [
        interalRequire.resolve('babel-preset-es2015'),
        interalRequire.resolve('babel-preset-react'),
        interalRequire.resolve('babel-preset-stage-0'),
      ],
      plugins: [
        interalRequire.resolve('babel-plugin-transform-runtime'),
        interalRequire.resolve('babel-plugin-add-module-exports'),
        interalRequire.resolve('babel-plugin-syntax-dynamic-import'),
        interalRequire.resolve('babel-plugin-syntax-jsx'),
        interalRequire.resolve('babel-plugin-transform-decorators-legacy'),
        interalRequire.resolve('babel-plugin-transform-proto-to-assign'),
      ],
    })
  }
  return mainBabelOptions
}
