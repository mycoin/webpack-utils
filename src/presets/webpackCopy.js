import minify from 'minify'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const createTransformer = (isDevelopment) => (source, fileName) => {
  if (!isDevelopment && /\.(js|css)$/i.test(fileName)) {
    return minify(fileName)
  }
  return source
}

export default (webpackCopy, otherOptions) => {
  const { paths, isDevelopment } = otherOptions
  const { mapper } = webpackCopy

  const patternList = []
  const transform = createTransformer(isDevelopment)

  if (mapper && typeof mapper === 'object') {
    Object.keys(mapper).forEach((targetName) => {
      patternList.push({
        from: paths.resolvePath(mapper[targetName]),
        to: targetName,
        transform,
      })
    })
  }

  return new CopyWebpackPlugin(patternList)
}
