const testerMap = {
  javascript: /\.(js|jsx)$/,
  sass: /\.(scss|sass)$/,
}

const loaderWhen = (extName, useOrLoader, otherProps) => {
  const result = {
    test: testerMap[extName] || new RegExp('\\.' + extName + '$'),
    use: useOrLoader,
    ...otherProps,
  }
  return result
}

const requireResolve = (moduleName) => require.resolve(moduleName)
const createProxy = (getter) => {
  const internal = {}
  const proxy = new Proxy(internal, {
    get(target, fieldName) {
      if (typeof internal[fieldName] === 'undefined') {
        internal[fieldName] = getter(fieldName, internal)
      }
      return internal[fieldName]
    },
  })
  return proxy
}

const createHandler = (webpackConfig, options) => {
  const { plugins } = webpackConfig
  const handler = {
    options,
    build() {
      return webpackConfig
    },
    addPlugin(plugin) {
      if (Array.isArray(plugin)) {
        plugin.forEach((item) => this.addPlugin(item))
      } else if (plugin) {
        plugins.push(plugin)
      }
    },
  }
  return handler
}

module.exports = {
  loaderWhen,
  createProxy,
  createHandler,
  requireResolve,
}
