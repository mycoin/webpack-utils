/* eslint-disable no-else-return */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable global-require, import/no-dynamic-require */
import { merge } from 'webpack-merge'
import { cosmiconfigSync } from 'cosmiconfig'
import defaults from './defaults'
import logger from './logger'
import internalExtends from './extends'
import { initExternalResolver } from './extends/util'
import {
  extendIfNecessary,
  resolveWebpackPath,
  getPortNumber,
  safeCreateArray,
  lookupRequireModule } from './utils'

const initDevServer = (listen, packageName) => {
  const finalServerOpt = {
    host: '127.0.0.1',
    port: 4444,
  }
  if (/true/.test(listen)) {
    finalServerOpt.port = getPortNumber(packageName)
  } else if (Number(listen)) {
    finalServerOpt.port = Number(listen)
  } else {
    finalServerOpt.useWebpackWatch = true
  }
  return finalServerOpt
}

const getWorkspaceOpt = (cliOptions) => {
  const explorer = cosmiconfigSync('takla')
  const result = explorer.search(cliOptions.cwd) || {}

  return result.config || {
    extends: 'defaults',
  }
}

/**
 * find extend defination
 *
 * @param {String} extendName
 */
const lookupExtender = (extendName, otherOptions) => {
  const { paths } = otherOptions
  if (internalExtends[extendName]) {
    return internalExtends[extendName]
  }

  return lookupRequireModule(extendName, {
    dirName: paths.documentRoot,
    paths: [
      paths.userNodeModulesPath,
    ],
  })
}

/**
 * extend other config, like takla-amd-module....
 *
 * @param {Object} builderOption
 * @param {Object} otherOptions
 */
const executeExtenders = (builderOption, otherOptions) => {
  const extendNames = []
  const executeParameter = {
    ...defaults.defaultExtendOpt,
  }

  // handle parameters
  safeCreateArray(otherOptions.extends).forEach((item) => {
    if (typeof item === 'string') {
      extendNames.push(item)
    } else if (item && typeof item === 'object') {
      Object.assign(executeParameter, item)
    }
  })

  // init execute parameter
  initExternalResolver(executeParameter, otherOptions)
  extendNames.forEach((extendName) => {
    if (executeParameter.isSkip) {
      return
    }

    const extenderExport = lookupExtender(extendName, otherOptions) || {}
    const extendsDef = extenderExport.webpackMixin || extenderExport
    if (typeof extendsDef === 'function') {
      if (extendsDef(builderOption, otherOptions, executeParameter) === false) {
        executeParameter.isSkip = true
      }
      logger.debug('extends loaded: ' + extendName)
    } else {
      throw new TypeError('invalid extends: `' + extendName + '`')
    }
  })
}

export default (cliOpts) => {
  const workspaceOpt = getWorkspaceOpt(cliOpts)
  const otherOptions = extendIfNecessary(defaults.defaultWebpackOptions, workspaceOpt)
  const pathOptions = resolveWebpackPath(cliOpts.cwd, {
    ...defaults.defaultPathOptions,
    ...workspaceOpt.paths,
  })

  // isDevelopment
  if (cliOpts.nodeEnv === 'development') {
    otherOptions.isDevelopment = true
  } else if (cliOpts.nodeEnv === 'production') {
    otherOptions.isDevelopment = false
  }

  otherOptions.paths = pathOptions
  otherOptions.packageJSON = lookupRequireModule(pathOptions.packagePath)
  otherOptions.nodeEnv = cliOpts.nodeEnv
  otherOptions.isVerbose = !!cliOpts.verbose

  const builderOption = merge(
    defaults.initWebpackConfig(otherOptions),
    workspaceOpt.webpack || {},
  )

  builderOption.externals = safeCreateArray(builderOption.externals)
  builderOption.devServer = {
    ...builderOption.devServer,
    ...initDevServer(workspaceOpt.listen, otherOptions.packageJSON.name),
  }

  // extenders
  executeExtenders(builderOption, otherOptions)

  return {
    builderOption,
    otherOptions,
  }
}
