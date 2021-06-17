/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')

module.exports = (documentRoot) => {
  const mainBabelOptions = {
    babelrc: false,
    cacheDirectory: true,
  }
  if (fs.existsSync(path.join(documentRoot, '.babelrc'))) {
    mainBabelOptions.babelrc = true
  }
  return mainBabelOptions
}
