const { merge } = require('webpack-merge')
const { ensureList } = require('./util')

const execRegex = {
  javascript: /\.(js|jsx)$/,
  sass: /\.(scss|sass)$/,
}

const createPattern = (extName) => {
  if (extName instanceof RegExp) {
    return extName
  } else if (execRegex[extName]) {
    return execRegex[extName]
  }
  return new RegExp('\\.' + extName + '$')
}

module.exports = class WebpackChain {
  constructor(webpackConfig) {
    this.webpackConfig = webpackConfig
  }

  // merge webpack configuration
  merge(configuration, replace) {
    if (configuration && typeof configuration === 'object') {
      if (replace === true) {
        this.webpackConfig = {
          ...this.webpackConfig,
          ...configuration,
        }
      } else {
        this.webpackConfig = merge(this.webpackConfig, configuration)
      }
    }
    return this
  }

  entry(entry) {
    return this.merge({
      entry,
    })
  }

  registerPlugin(plugins) {
    return this.merge({
      plugins: ensureList(plugins),
    })
  }

  loaderWhen(extName, loaders, otherProps) {
    return this.merge({
      module: {
        rules: [{
          test: createPattern(extName),
          use: loaders,
          ...otherProps,
        }],
      },
    })
  }

  devServer(devServer) {
    return this.merge({
      devServer,
    })
  }

  extract() {
    return this.webpackConfig
  }
}
