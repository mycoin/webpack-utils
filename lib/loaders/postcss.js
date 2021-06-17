/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { cosmiconfigSync } = require('cosmiconfig')

module.exports = (documentRoot) => {
  const explorerSync = cosmiconfigSync('postcss')
  const result = explorerSync.search(documentRoot)

  if (result && result.config) {
    return result.config
  }

  return null
}
