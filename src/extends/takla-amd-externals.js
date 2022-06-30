/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { getDependencies, getNameWithNamespace, isShouldExternalReq } from './util'

export default (webpackConfig, otherOptions, extendOption) => {
  const { externals, output } = webpackConfig
  const dependencies = getDependencies(otherOptions)

  output.libraryTarget = 'amd'
  output.library = undefined

  // handle external dependencies(include peerDependencies)
  externals.push((context, request, callback) => {
    if (request in dependencies) {
      if (isShouldExternalReq(request, extendOption)) {
        return callback(null, 'amd ' + getNameWithNamespace(extendOption, request))
      }
    }
    return callback()
  })
}
