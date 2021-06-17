module.exports = (options) => {
  return {
    entry: options.entry,
    target: 'web',
    mode: options.mode,
    context: options.documentRoot,
    externals: [],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts'],
      mainFiles: ['index'],
      alias: {
        '@': options.chdir('src'),
      },
      plugins: [],
    },
    module: {
      rules: [],
    },
    devtool: 'source-map',
    performance: {
      hints: 'warning',
      maxAssetSize: 8 * 1024 * 1024,
      maxEntrypointSize: 8 * 1024 * 1024,
    },
    optimization: {
      minimize: !options.developmentMode,
      minimizer: [],
    },
    plugins: [],
    output: {
      path: options.target,
      filename: '[name].js',
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        module: false,
      },
    },
  }
}
