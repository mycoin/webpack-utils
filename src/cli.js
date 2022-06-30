/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import path from 'path'
import logger from './logger'
import doNormalizer from './normalizer'
import commanderMap from './commands'

const normalizerEnv = (resolvedParams) => {
  if (resolvedParams.context) {
    process.chdir(path.resolve(resolvedParams.context))
  }
  if (resolvedParams.production) {
    process.env.NODE_ENV = 'production'
  }
  resolvedParams.cwd = process.cwd()
  resolvedParams.nodeEnv = process.env.NODE_ENV || 'development'

  return resolvedParams
}

export default (actionName, cliParams) => {
  const options = normalizerEnv(cliParams)
  const { builderOption, otherOptions } = doNormalizer(options)

  try {
    commanderMap[actionName](builderOption, otherOptions)
  } catch (e) {
    if (cliParams.verbose) {
      throw e
    } else if (/Cannot find/.test(e.message)) {
      logger.fatal('unknown action')
      return
    }
    throw e
  }
}
