const { merge } = require('webpack-merge')

module.exports = (option, mergeOption) => {
  const webpackConfig = {
    entry: '@/index',
    target: 'web',
    mode: option.mode,
    context: option.documentRoot,
    externals: [],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts'],
      mainFiles: ['index'],
      alias: {
        '@': option.chdir('src'),
      },
      plugins: [],
    },
    module: {
      rules: [],
    },
    plugins: [],
    performance: {
      hints: 'warning',
      maxAssetSize: 8 * 1024 * 1024,
      maxEntrypointSize: 8 * 1024 * 1024,
    },
    optimization: {
      minimize: !option.isDevelopment,
      minimizer: [],
    },
    output: {
      path: option.outputPath,
      publicPath: option.publicPath,
      filename: '[name].js',
      chunkFilename: '[hash].js',
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        module: false,
      },
    },
    devServer: {
      inline: true,
      hot: true,
      disableHostCheck: true,
      publicPath: option.publicPath,
      writeToDisk: true,
      stats: {
        colors: true,
        chunks: false,
      },
    },
    devtool: option.isDevelopment
      ? 'cheap-module-source-map'
      : 'source-map',
  }

  // merge webpackConfig
  if (mergeOption && typeof mergeOption === 'object') {
    return merge(webpackConfig, mergeOption)
  }
  return webpackConfig
}
