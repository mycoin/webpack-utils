/* eslint-disable import/no-dynamic-require */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable global-require, prefer-template */
import fs from 'fs'
import path from 'path'

/**
 * format webpack needed paths
 *
 * @param {String} documentRoot
 * @param {Object} pathOptions
 */
const resolveWebpackPath = (documentRoot, pathOptions) => {
  const resolvePath = (dirName) => {
    if (dirName && dirName.indexOf(documentRoot) === 0) {
      return dirName
    }
    return path.join(documentRoot, dirName)
  }
  const { userSrcPath, publicPath, buildPath, ...otherProps } = pathOptions
  const returnMap = {
    ...otherProps,
    resolvePath,
    documentRoot,
    userSrcPath: resolvePath(userSrcPath),
    packagePath: resolvePath('package.json'),
    buildPath: resolvePath(buildPath),
    userNodeModulesPath: resolvePath('node_modules'),
  }
  if (publicPath && typeof publicPath === 'string') {
    returnMap.targetURL = publicPath
  } else {
    returnMap.targetURL = './'
  }

  return returnMap
}

/**
 * Request module output' object
 *
 * @param {String} modulePath
 * @param {Function} externalRequire `require`
 * @param {Object} defaultValue
 */
const lookupRequireModule = (moduleId, requireOption) => {
  const { dirName, paths } = requireOption || {}
  const safeRequire = (file, options) => {
    try {
      const moduleIdDir = require.resolve(file, options)
      const moduleExport = require(moduleIdDir)
      const config = moduleExport.default || moduleExport
      return config
    } catch (e) {
      if (/Cannot find/.test(e)) {
        return null
      }
      throw e
    }
  }
  if (dirName) {
    const moduleFromDirName = safeRequire(dirName + '/' + moduleId)
    if (moduleFromDirName) {
      return moduleFromDirName
    }
  }
  return safeRequire(moduleId, {
    paths,
  })
}

const readFileSync = (fileName) => {
  try {
    return String(fs.readFileSync(fileName))
  } catch (e) {
    return null
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

const getPortNumber = (packageName) => {
  let code = 1024
  if (!packageName) {
    return code
  }
  for (let index = 0; index < packageName.length; index++) {
    code += packageName[index].charCodeAt(0)
  }
  return code
}

const safeCreateArray = (item) => {
  if (Array.isArray(item)) {
    return item
  }
  return item ? [item] : []
}

const isPatternMatch = (value, pattern) => {
  if (Array.isArray(pattern)) {
    return pattern.includes(value)
  }
  if (pattern instanceof RegExp) {
    return pattern.test(value)
  }
  if (pattern === 'function') {
    return pattern(value)
  }
  return pattern === value
}

const getToStringOption = (otherOptions) => {
  const toStringOption = {
    colors: true,
    chunks: false,
    children: false,
    maxModules: 200,
  }
  if (otherOptions.isVerbose) {
    toStringOption.all = true
  }
  return toStringOption
}

export {
  getToStringOption,
  extendIfNecessary,
  getPortNumber,

  isPatternMatch,
  readFileSync,
  lookupRequireModule,
  resolveWebpackPath,
  safeCreateArray,
}
