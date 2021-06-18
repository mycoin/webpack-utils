const { createProxy } = require('./util')
const loaders = require('./internal/loaders')

module.exports = (option, defaultResolver) => {
  const get = (fieldName) => {
    if (typeof loaders[fieldName] === 'function') {
      return loaders[fieldName](option)
    }

    return typeof defaultResolver === 'function'
      ? defaultResolver(fieldName)
      : defaultResolver
  }
  return createProxy((fieldName, target) => {
    return target[fieldName] || get(fieldName)
  })
}
