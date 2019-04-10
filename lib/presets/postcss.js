/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')
const { requireGivenModule } = require('../utils')

/**
 * require `postcss.config.js`, If config not found, return the presets
 *
 * @param {String} documentRoot
 * @param {Function} externalRequire
 */
module.exports = (documentRoot, externalRequire) => {
  const interalRequire = externalRequire || require
  const postcssRc = path.join(documentRoot, '.postcssrc.js')
  const mainPostcssOptions = {
    ident: 'postcss',
    plugins: null,
  }

  if (fs.existsSync(postcssRc)) {
    return requireGivenModule(postcssRc, interalRequire)
  }

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
  return mainPostcssOptions
}
