/* eslint-disable prefer-template */
/* eslint-disable global-require */

const path = require('path')
const Stats = require('webpack/lib/Stats')

const resolveWebpackPath = (pathOptions) => {
  const documentRoot = path.resolve(pathOptions.documentRoot || process.cwd())
  const getResolvedPath = (dirName) => {
    if (dirName.indexOf(documentRoot) === -1) {
      return path.join(documentRoot, dirName)
    }
    return dirName
  }

  return {
    documentRoot,
    getResolvedPath,

    buildPath: getResolvedPath(pathOptions.buildPath),
    userSrcPath: getResolvedPath(pathOptions.userSrcPath),
    packagePath: getResolvedPath('package.json'),
    userNodeModulesPath: getResolvedPath('node_modules'),
    publicPath: pathOptions.publicPath,
  }
}

/**
 * normalize statOption
 *
 * @param {String|Object} statOption
 * @param {Object=} overideOptions
 */
const resolveStatsOptions = (statOption, overideOptions) => {
  const returnOptions = {
    colors: true,
    modules: true,
  }
  if (typeof statOption === 'string') {
    const statsOptionsList = [
      'none',
      'verbose',
      'detailed',
      'minimal',
      'errors-only',
      'normal',
    ]
    if (statsOptionsList.indexOf(statOption) === -1) {
      throw new TypeError('statsOptions accepted values: ' + statsOptionsList.join(', '))
    }

    Object.assign(returnOptions, Stats.presetToOptions(statOption))
  } else if (statOption && typeof statOption === 'object') {
    Object.assign(returnOptions, statOption)
  }
  return Object.assign(returnOptions, overideOptions)
}

/**
 * Request module output' object
 *
 * @param {String} modulePath
 * @param {Function} externalRequire `require`
 * @param {Object} defaultValue
 */
const requireGivenModule = (modulePath, externalRequire, defaultValue) => {
  const file = path.resolve(modulePath)
  const internalRequire = externalRequire || require

  try {
    const returnModule = internalRequire(file)
    const config = returnModule.default || returnModule

    return config || defaultValue
  } catch (e) {
    return defaultValue
  }
}

/**
 * On-demand Template Supplementary Objects
 *
 * @param {Object} dataTemplator
 * @param {Object} target
 */
const extendIfNecessary = (dataTemplator, target) => {
  const returnMap = {}
  const objectTarget = target || {}

  if (Array.isArray(dataTemplator)) {
    return dataTemplator.map((item) => item)
  }

  if (dataTemplator && typeof dataTemplator === 'object') {
    for (const keyName in dataTemplator) { // eslint-disable-line
      if (objectTarget[keyName] === undefined) {
        returnMap[keyName] = dataTemplator[keyName]
      } else {
        returnMap[keyName] = objectTarget[keyName]
      }
    }
    return returnMap
  }

  return target === undefined ? dataTemplator : target
}

module.exports = {
  extendIfNecessary,
  requireGivenModule,
  resolveStatsOptions,
  resolveWebpackPath,
}
