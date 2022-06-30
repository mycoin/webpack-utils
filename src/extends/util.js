/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { isPatternMatch, lookupRequireModule } from '../utils'

const getDependencies = (otherOptions) => {
  const { packageJSON } = otherOptions
  const allDependencies = {
    ...packageJSON.dependencies,
    ...packageJSON.peerDependencies,
  }
  return allDependencies
}

/**
 * get module id with naming
 *
 * @param {Object} extendOption
 * @param {String} moduleName from request
 */
const getNameWithNamespace = (extendOption, moduleName) => {
  if (extendOption.amdNamespace) {
    return extendOption.amdNamespace + moduleName
  }
  return moduleName || null
}

/**
 * whether if necessary to be externaled !!!IMPORTANT!!!
 *
 * @param {String} request
 * @param {Object} extendOption
 */
const isShouldExternalReq = (request, extendOption) => {
  const { externalExcludes, externalIncludes, externalAll } = extendOption
  if (isPatternMatch(request, externalExcludes)) {
    return false
  }
  return externalAll || isPatternMatch(request, externalIncludes)
}

const isMultiEntry = (entry) => {
  if (!entry || Array.isArray(entry)) {
    return false
  }
  return entry && typeof entry === 'object'
}

const initExternalResolver = (executeParameter, otherOptions) => {
  const { paths } = otherOptions
  const { externalIncludes, externalResolver } = executeParameter
  if (externalResolver) {
    const resolverPath = require.resolve(externalResolver, {
      paths: [
        paths.userNodeModulesPath,
      ],
    })

    // get `packages` field
    const { packages } = lookupRequireModule(resolverPath)
    Object.keys(packages || {}).forEach((moduleId) => {
      externalIncludes.push(moduleId)
    })

    if (externalIncludes.length) {
      // eslint-disable-next-line no-param-reassign
      executeParameter.externalAll = false
    }
  }
}

export {
  getDependencies,
  getNameWithNamespace,

  initExternalResolver,
  isShouldExternalReq,
  isMultiEntry,
}
