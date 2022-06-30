#!/usr/bin/env node
const parser = require('yargs-parser')
const { default: cli, logger } = require('..')

const argv = process.argv.slice(3)
const cliParams = parser(argv)
const actionName = process.argv[2] || 'dev'
const actionNameAlias = {
  dev: 'watch',
}

process.on('SIGINT', process.exit)
process.on('unhandledRejection', (error) => {
  logger.error(cliParams.verbose ? error : error.message)
  process.exit(1)
})

if (cliParams.verbose) {
  logger.setLogLevel(0)
}

cli(actionNameAlias[actionName] || actionName, cliParams)
