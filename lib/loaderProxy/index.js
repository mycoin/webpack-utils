const creators = require('./creators')
const { createProxy } = require('../util')

/**
 * loaderProxy
 *
 * @param {Object} option
 * @param {Function|Object} defaultResolver
 * @returns
 */
module.exports = (option, defaultResolver) => {
  const get = (loaderName) => {
    if (typeof creators[loaderName] === 'function') {
      return creators[loaderName](option)
    }
    return typeof defaultResolver === 'function'
      ? defaultResolver(loaderName + '-loader', loaderName)
      : undefined
  }

  return createProxy((loaderName, target) => {
    return target[loaderName] || get(loaderName)
  })
}
