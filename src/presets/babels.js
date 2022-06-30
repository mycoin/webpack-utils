/* eslint-disable no-multi-str */
/* eslint-disable global-require */
import { cosmiconfigSync } from 'cosmiconfig'
import logger from '../logger'

export default (documentRoot) => {
  const mainBabelOptions = {
    babelrc: false,
    cacheDirectory: true,
  }
  const explorerSync = cosmiconfigSync('babel', {
    searchPlaces: [
      '.babelrc',
      'babel.config.json',
    ],
  })
  const result = explorerSync.search(documentRoot)
  if (result && result.config) {
    if (result.filepath.endsWith('.babelrc')) {
      logger.fatal('use Project-wide configuration, rename `.babelrc` to `babel.config.json`,see: https://babeljs.io/docs/en/config-files')
      process.exit(1)
    }
    return result.config
  }

  return mainBabelOptions
}
