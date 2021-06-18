const webpack = require('webpack')

const execRegexMap = {
  javascript: /\.(js|jsx)$/,
  sass: /\.(scss|sass)$/,
}

class WebpackChain {
  constructor(webpackConfig, options) {
    this.webpackConfig = webpackConfig
    this.options = options
  }

  // 添加构建工具插件
  registerPlugin(plugin) {
    const { plugins } = this.webpackConfig
    if (Array.isArray(plugin)) {
      plugin.forEach((item) => this.registerPlugin(item))
    } else if (plugin) {
      plugins.push(plugin)
    }
    return this
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
    const { module } = this.webpackConfig
    const moduleRules = module.rules || []
    const pattern = execRegexMap[extName] || new RegExp('\\.' + extName + '$')

    moduleRules.push({
      test: pattern,
      use: loaders,
      ...otherProps,
    })

    // re-assign
    module.rules = moduleRules
    return this
  }

  build() {
    return webpack(this.webpackConfig)
  }
}

module.exports = WebpackChain
