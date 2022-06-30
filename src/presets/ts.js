/* eslint-disable global-require */
import fs from 'fs'
import path from 'path'

export default (documentRoot) => {
  const tsconfig = path.join(documentRoot, 'tsconfig.json')
  const mainTsOptions = {
    context: documentRoot,
  }
  if (fs.existsSync(tsconfig)) {
    mainTsOptions.configFile = tsconfig
  } else {
    mainTsOptions.configFile = path.join(__dirname, 'tsconfig.json')
  }
  return mainTsOptions
}
