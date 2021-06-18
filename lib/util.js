const requireResolve = (moduleName) => require.resolve(moduleName)
const createProxy = (getter) => {
  const internal = {}
  const proxy = new Proxy(internal, {
    get(target, fieldName) {
      if (internal[fieldName] === undefined) {
        internal[fieldName] = getter(fieldName, internal)
      }
      return internal[fieldName]
    },
  })
  return proxy
}

const terserOptions = {
  ie8: true,
  safari10: true,
  mangle: {
    reserved: ['define', 'require', 'module', 'exports'],
  },
  output: {
    beautify: false,
    comments: false,
    ascii_only: true,
  },
}

module.exports = {
  createProxy,
  requireResolve,
  terserOptions,
}
