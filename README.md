# webpack-utils

This package includes some utilities for quick webpack builder

- Using webpack3,  [documentation](https://webpack-3.cdn.bcebos.com/)
- Features:
  - babel 6, preset: *es2015*, *react* and *stage-0*
  - `webpack-runtime-public-path-plugin@1` setup the public path
  - `write-file-webpack-plugin` auto emmit files to "build/"

### 1. how to use ?

```shell
npm install webpack-utils --save-dev
```

create `build.config.js` like:

```js
module.exports = {
  entry: {
    'main': '@/main',
    'vendor-base': '@/vendors/vendor-base',
    'vendor-exten': '@/vendors/vendor-exten',
  },
  // other config...
}
```

main:

```javascript

const { webpack, webpackCoreFactory, webpackRun, utils } = require('webpack-utils')

const { requireGivenModule, resolvePath } = utils
const buildConfig = requireGivenModule('build.config.js')

// some shorthand options
const webpackOptions = {
  context: '.',
	paths: {
    buildPath: 'dist',
    publicPath: 'http://127.0.0.1:4444/', // static publicPath ? or `runtimePublicPath`
  },
  statsOptions: 'normal',
  liveReloadOptions: 35728,
  runtimePublicPath: '(Window.globalData||{}).assetsRoot||"/"',

  copyOptions: [], // copy-webpack-plugin
  commonChunks: {
    minChunks: Infinity,
    name: [
      'vendor-exten',
      'vendor-base',
    ],
  },

  processWebpack: (config, options, webpackInst) => {},
  middleware: (app, server) => {},
  afterBuilt: (error, stats, context) => {},
  afterWatched: (server, options, context) => {},
}

// build | watch
webpackRun('watch', webpackCoreFactory(buildConfig, webpackOptions), webpackOptions)
```

available `webpackOptions`  see:  <https://github.com/mycoin/webpack-utils/blob/master/lib/defaults.js>

### 2. examples ?

- builder example [sample-webpack-builder](<https://github.com/mycoin/webpack-utils/tree/master/examples/sample-webpack-builder>)

- project example [sample-web-project](https://github.com/mycoin/webpack-utils/tree/master/examples/sample-web-project)

  ```
  cd examples/sample-web-project && node ../sample-webpack-builder/main.js
  ```

  goto: <http://127.0.0.1:4444/>



---

@mycoin
