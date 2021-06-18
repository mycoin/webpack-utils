const nocache = require('nocache')
const cors = require('cors')
const comboHandler = require('combo-handler')

exports.createBefore = (options) => (app, server) => {
  if (typeof options.middleware === 'function') {
    options.middleware(app, options, server)
  }

  app.use(nocache())
  app.use(cors())
  app.use('/', comboHandler({
    base: options.documentRoot,
  }))
}
