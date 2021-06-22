const crypto = require('crypto')

const execRegexMap = {
  javascript: /\.(js|jsx)$/,
  sass: /\.(scss|sass)$/,
}

const createPattern = (extName) => {
  if (extName instanceof RegExp) {
    return extName
  } else if (execRegexMap[extName]) {
    return execRegexMap[extName]
  }
  return new RegExp('\\.' + extName + '$')
}

const ensureList = (params) => {
  if (Array.isArray(params)) {
    return params
  } else if (params === undefined || params === null) {
    return []
  }
  return [params]
}

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

// avoid naming conflict
const getUniqueName = (pkg) => {
  const md5 = crypto.createHash('md5')
  const keyName = pkg.name
  const result = md5.update(keyName + '')
    .digest('base64')
    .replace(/[^A-Z0-9]/gi, '')

  return result.substring(0, 8)
}

const getTerserOptions = () => ({
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
})

module.exports = {
  getUniqueName,
  ensureList,
  createProxy,
  createPattern,
  requireResolve,
  getTerserOptions,
}
