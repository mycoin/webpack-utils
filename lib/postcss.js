/* eslint-disable global-require */

module.exports = {
  ident: 'postcss',
  plugins: (loader) => [
    require('postcss-import')({
      root: loader.resourcePath,
    }),
    require('postcss-preset-env')(),
    require('cssnano')(),
    require('autoprefixer')({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9',
      ],
      flexbox: 'no-2009',
    }),
  ],
}
