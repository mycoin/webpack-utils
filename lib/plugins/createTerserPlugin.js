const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = () => {
  return new TerserWebpackPlugin({
    parallel: true,
    terserOptions: {
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
    },
  })
}
