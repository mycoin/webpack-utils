module.exports = {
  // raw webpack config
  webpack: {
    entry: {
      'main': '@/main',
      'vendor-base': '@/vendors/vendor-base',
      'vendor-exten': '@/vendors/vendor-exten',
    },
  },

  // donot use `fast-css-loader` and `fast-scss-loader`
  optimize: false,
  paths: {
    buildPath: 'dist',
    publicPath: 'http://cdn/group/project',
  },

  // see: webpack-runtime-public-path-plugin
  runtimePublicPath: 'Window.globalData.assetsRoot',

  // livereload, but <script> is required!
  liveReloadOptions: 35728,

  // statsOptions: 'verbose',
  statsOptions: {
    colors: true,
  },

  // copyOptions: [{
  //   from: 'src/assets/',
  //   to: 'assets/',
  // }],

  // commonChunks, passed to webpack.optimize.CommonsChunkPlugin(), Array ot Object
  commonChunks: {
    minChunks: Infinity,
    name: [
      'vendor-exten',
      'vendor-base',
    ],
  },

  // DevServer
  listen: '127.0.0.1:4444',
}
