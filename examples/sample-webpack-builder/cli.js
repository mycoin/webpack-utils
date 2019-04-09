#! /usr/bin/env node

const parser = require('yargs-parser')
const webpackCore = require('./webpack-builder')

process.on('SIGINT', process.exit)
process.on('unhandledRejection', (err) => {
  throw err
})

const argv = process.argv.slice(3)
const params = parser(argv)

if (params.production) {
  process.env.NODE_ENV = 'production'
}

webpackCore(process.argv[2] || 'dev', {
  ...params,
  nodeEnv: process.env.NODE_ENV || 'development',
})
