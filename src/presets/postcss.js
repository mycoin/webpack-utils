/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { cosmiconfigSync } from 'cosmiconfig'

export default (documentRoot) => {
  const explorerSync = cosmiconfigSync('postcss')
  const result = explorerSync.search(documentRoot)

  if (result && result.config) {
    return {
      postcssOptions: result.config,
    }
  }

  return null
}
