const TerserPlugin = require('terser-webpack-plugin')

module.exports = () => {
  return new TerserPlugin({
    parallel: true,
    terserOptions: {
      ie8: true,
      safari10: true,
      mangle: {
        reserved: ['define', 'require', 'module', 'exports'],
      },
      output: {
        ascii_only: true,
      },
    },
  })
}
