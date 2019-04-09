# webpack-utils

This package includes some utilities for quick webpack builder

- use webpack3,  [read documentation](https://webpack-3.cdn.bcebos.com/)
- some features:
  - babel 6, preset: *es2015*, *react* and *stage-0*
  - `webpack-runtime-public-path-plugin@1` handle the public path 
  - `write-file-webpack-plugin` auto emmit to files
- for more: 
  - examples [sample-webpack-builder

### how to use ?

```shell
npm install webpack-utils --save-dev
```

create `build.config.js` like:

```js
module.exports = {
  webpack: {
    entry: {
      'main': '@/main',
      'vendor-base': '@/vendors/vendor-base',
      'vendor-exten': '@/vendors/vendor-exten',
    },
  },
  optimize: true,
  runtimePublicPath: 'Window.globalData.assetsRoot',
  commonChunks: {
    minChunks: Infinity,
    name: [
      'vendor-exten',
      'vendor-base',
    ],
  },
  listen: '127.0.0.1:4434',
}

```

update the `package.json`

```json
...
"scripts": {
    "dev": "webpack-builder dev",
    "build": "webpack-builder build --production",
    "build-local": "webpack-builder build"
},

```

available options:

```
postcssOptions: null
babelOptions: null
cssLoaderName: 'css-loader'
scssLoaderName: 'sass-loader'
liveReloadOptions: null
runtimePublicPath: null
copyOptions: null
commonChunks: null
assetsManifestOptions: null
normalizedPaths: null
middleware: () => {}
processWebpack: null
afterBuilt: null
```



---

@mycoin