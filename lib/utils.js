/* eslint-disable global-require */
const path = require('path')
const fs = require('fs')

const resolvePath = (relativePath) => {
  const documentRoot = path.resolve(relativePath || process.cwd())
  const getResolvedPath = (dirName) => path.join(documentRoot, dirName)

  return {
    documentRoot,
    buildPath: getResolvedPath('build/'),
    userSrcPath: getResolvedPath('src/'),
    packagePath: getResolvedPath('package.json'),
    userNodeModulesPath: getResolvedPath('node_modules/'),
    publicPath: '/',
    getResolvedPath,
  }
}

const initPostcssOptions = (documentRoot, externalRequire) => {
  const interalRequire = externalRequire || require
  const postcssRc = path.join(documentRoot, '.postcssrc.js')
  const mainPostcssOptions = {
    ident: 'postcss',
    plugins: null,
  }

  if (fs.existsSync(postcssRc)) {
    console.error('object') // eslint-disable-line
  } else {
    mainPostcssOptions.plugins = (loader) => [
      interalRequire('postcss-import')({
        root: loader.resourcePath,
      }),
      interalRequire('postcss-preset-env')(),
      interalRequire('cssnano')(),
      interalRequire('autoprefixer')({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9',
        ],
        flexbox: 'no-2009',
      }),
    ]
  }
  return mainPostcssOptions
}

const initBabelOptions = (documentRoot, externalRequire) => {
  const interalRequire = externalRequire || require

  const babelRcPath = path.join(documentRoot, '.babelrc')
  const hasBabelRc = fs.existsSync(babelRcPath)
  const mainBabelOptions = {
    babelrc: false,
    cacheDirectory: true,
    compact: false,
  }

  if (hasBabelRc) {
    mainBabelOptions.babelrc = true
  } else {
    Object.assign(mainBabelOptions, {
      presets: [
        interalRequire.resolve('babel-preset-es2015'),
        interalRequire.resolve('babel-preset-react'),
        interalRequire.resolve('babel-preset-stage-0'),
      ],
      plugins: [
        interalRequire.resolve('babel-plugin-transform-runtime'),
        interalRequire.resolve('babel-plugin-add-module-exports'),
        interalRequire.resolve('babel-plugin-syntax-dynamic-import'),
        interalRequire.resolve('babel-plugin-syntax-jsx'),
        interalRequire.resolve('babel-plugin-transform-decorators-legacy'),
        interalRequire.resolve('babel-plugin-transform-proto-to-assign'),
      ],
    })
  }
  return mainBabelOptions
}

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


const requireGivenModule = (modulePath, externalRequire) => {
  const file = path.resolve(modulePath)
  const internalRequire = externalRequire || require

  if (fs.existsSync(file)) {
    const returnModule = internalRequire(file)
    const config = returnModule.default || returnModule

    return config || {}
  }
  return {}
}

module.exports = {
  initBabelOptions,
  initPostcssOptions,
  extendIfNecessary,
  requireGivenModule,
  resolvePath,
}
