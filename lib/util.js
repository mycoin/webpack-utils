const testerMap = {
  javascript: /\.(js|jsx)$/,
  sass: /\.(scss|sass)$/,
}

const handlerWhen = (extName, useOrLoader, otherProps) => {
  const result = {
    test: testerMap[extName] || new RegExp('.' + extName + '$'),
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
        internal[fieldName] = getter(fieldName, internal) || null
      }
      return internal[fieldName]
    },
  })
  return proxy
}

module.exports = {
  handlerWhen,
  createProxy,
  requireResolve,
}
