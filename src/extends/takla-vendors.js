export default (webpackConfig) => {
  const { splitChunks } = webpackConfig.optimization
  const vendors = {
    enforce: true,
    test: /[\\/]node_modules[\\/]/,
    chunks: 'initial',
    name: 'vendors',
    filename: 'vendors.js',
  }
  Object.assign(splitChunks.cacheGroups, {
    vendors,
  })
}
