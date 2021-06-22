const { merge } = require('webpack-merge')
const { createPattern, ensureList } = require('./util')

class WebpackChain {
  constructor(webpackConfig, options) {
    this.webpackConfig = webpackConfig
    this.options = options
  }

  // merge webpack configuration
  merge(fieldName, value) {
    if (typeof fieldName === 'string') {
      this.merge({
        [fieldName]: value,
      })
    } else if (fieldName && typeof fieldName === 'object') {
      this.webpackConfig = merge(this.webpackConfig, fieldName)
    }
    return this
  }

  // 添加构建工具插件
  registerPlugin(plugins) {
    return this.merge({
      plugins: ensureList(plugins),
    })
  }

  /**
   * add rules
   *
   * @param {String} extName
   * @param {Array|Object} loaders
   * @param {Object?} otherProps
   * @returns
   */
  loaderWhen(extName, loaders, otherProps) {
    const nextRules = [{
      test: createPattern(extName),
      use: loaders,
      ...otherProps,
    }]
    const toMerge = {
      module: {
        rules: nextRules,
      },
    }
    return this.merge(toMerge)
  }

  devServer(devServer) {
    return this.merge({
      devServer,
    })
  }

  doExport() {
    return this.webpackConfig
  }
}

module.exports = WebpackChain
