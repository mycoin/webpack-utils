/* eslint-disable func-names */
/* eslint-disable global-require, prefer-template */

function RuntimePublicPath(options) {
  this.options = options || {}
  this.name = 'RuntimePublicPath'
}

RuntimePublicPath.prototype.apply = function (compiler) {
  const { runtimePath } = this.options
  if (!runtimePath) {
    throw new TypeError('RuntimePublicPath: no output.runtimePath is specified. This plugin will do nothing.')
  }

  compiler.hooks.thisCompilation.tap(this.name, (compilation) => {
    compilation.mainTemplate.plugin('require-extensions', (source) => {
      const injectScript = '__webpack_require__.p = ' + runtimePath + ';'
      const result = source + injectScript

      return result
    })
  })
}

export default RuntimePublicPath
