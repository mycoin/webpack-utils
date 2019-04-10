/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')

/**
 * require `tsconfig.json`, If config not found, return the presets
 * https://www.typescriptlang.org/docs/handbook/compiler-options.html
 *
 * @param {String} documentRoot
 */
module.exports = (documentRoot) => {
  const postcssRc = path.join(documentRoot, 'tsconfig.json')
  const mainTsOptions = {
    context: documentRoot,
  }

  if (fs.existsSync(postcssRc)) {
    mainTsOptions.configFile = postcssRc
  } else {
    mainTsOptions.experimentalWatchApi = true
    mainTsOptions.transpileOnly = true
  }

  return mainTsOptions
}
