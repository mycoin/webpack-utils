/* eslint-disable prefer-template */
/* eslint-disable no-console */

import util from 'util'
import chalk from 'chalk'

const moduleExports = {}
const buildLogger = (logName, logColor, level) => (...varArgs) => {
  if (process.env.TAKLA_LOG_SILENT || level < process.env.TAKLA_LOG_LEVEL) {
    return
  }
  const msg = util.format.apply(null, varArgs)
  if (msg) {
    console.log(chalk.dim('takla ') + logColor(logName.toUpperCase()) + ' ' + msg)
  } else {
    console.log()
  }
}

moduleExports.trace = buildLogger('trace', chalk.bgWhite, 0)
moduleExports.debug = buildLogger('debug', chalk.bgWhite, 1)
moduleExports.info = buildLogger('info', chalk.bgGreen, 2)
moduleExports.warn = buildLogger('warn', chalk.bgYellow, 3)
moduleExports.error = buildLogger('error', chalk.bgRed, 4)
moduleExports.fatal = buildLogger('fatal', chalk.bgRed, 5)
moduleExports.raw = (message) => {
  if (message) {
    console.log(message)
  }
}

moduleExports.setLogLevel = (levelNumber) => {
  if (typeof levelNumber === 'number') {
    process.env.TAKLA_LOG_LEVEL = levelNumber
  }
}
if (typeof process.env.TAKLA_LOG_LEVEL === 'undefined') {
  moduleExports.setLogLevel(2)
}

moduleExports.clear = () => {
  if (typeof process.stdout.clearLine === 'function') {
    process.stdout.clearLine()
  }
  if (typeof process.stdout.cursorTo === 'function') {
    process.stdout.cursorTo(0)
  }
}

export default moduleExports
/* vim: set ts=4 sw=4 sts=4 tw=100: */
