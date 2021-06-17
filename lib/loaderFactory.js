const { createProxy, requireResolve } = require('./util')
const loaders = require('./internal/loaders')

module.exports = (option) => {
  const get = (fieldName) => {
    if (typeof loaders[fieldName] === 'function') {
      return loaders[fieldName](option)
    }
    return {
      loader: requireResolve(fieldName + '-loader'),
      options: {},
    }
  }
  return createProxy((fieldName, target) => {
    return target[fieldName] || get(fieldName)
  })
}
