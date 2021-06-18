module.exports = (options) => {
  const outputEnvironment = {
    arrowFunction: false,
    const: false,
    destructuring: false,
    dynamicImport: false,
    module: false,
  }

  const webpackConfig = {
    entry: {
      index: '@/index',
    },
    target: 'web',
    mode: options.mode,
    context: options.documentRoot,
    externals: [],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts'],
      mainFiles: ['index'],
      alias: {
        '@': options.resolvePath('src'),
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
      minimize: !options.isDevelopment,
      minimizer: [],
    },
    output: {
      path: options.target,
      publicPath: options.publicPath,
      filename: '[name].js',
      environment: {
        ...outputEnvironment,
      },
    },
    devServer: {
      inline: true,
      hot: true,
      disableHostCheck: true,
      publicPath: options.publicPath,
      writeToDisk: true,
      stats: {
        colors: true,
        chunks: false,
      },
    },
    devtool: options.isDevelopment
      ? 'cheap-module-source-map'
      : 'source-map',
  }
  return webpackConfig
}
