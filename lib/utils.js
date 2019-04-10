/* eslint-disable global-require */
const path = require('path')
const fs = require('fs')
const Stats = require('webpack/lib/Stats')

const resolvePath = (relativePath) => {
  const documentRoot = path.resolve(relativePath || process.cwd())
  const getResolvedPath = (dirName) => path.join(documentRoot, dirName)

  return {
    documentRoot,
    buildPath: getResolvedPath('build/'),
    userSrcPath: getResolvedPath('src/'),
    packagePath: getResolvedPath('package.json'),
    userNodeModulesPath: getResolvedPath('node_modules/'),
    publicPath: '/',
    getResolvedPath,
  }
}

/**
 * normalize statOption
 *
 * @param {String|Object} statOption
 * @param {Object=} forceOverideOptions
 */
const resolveStatsOptions = (statOption, forceOverideOptions) => {
  const returnStatsOptions = {
    colors: true,
  }

  if (statOption && typeof statOption === 'object') {
    Object.assign(returnStatsOptions, statOption)
  } else if (typeof statOption === 'string') {
    Object.assign(returnStatsOptions, Stats.presetToOptions(statOption))
  }

  return Object.assign(returnStatsOptions, forceOverideOptions)
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

  if (fs.existsSync(file)) {
    const returnModule = internalRequire(file)
    const config = returnModule.default || returnModule

    return config || defaultValue
  }
  return defaultValue
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
  resolveStatsOptions,
  requireGivenModule,
  resolvePath,
}
