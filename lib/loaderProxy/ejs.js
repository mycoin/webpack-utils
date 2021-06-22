/* eslint-disable max-len */
/* eslint-disable global-require, prefer-template */
const loaderUtils = require('loader-utils')
const lodashTemplate = require('lodash.template')
const { minify } = require('html-minifier-terser')

const runtimePath = require.resolve('./ejsRuntime')
const renderTpl = lodashTemplate(`
  /*Loaded over EjsLoader*/
  const _ = require("<%=runtimePath%>");
  <%if(esModule){%>
    export default <%=content%>;
  <%}else{%>
    module.exports = <%=content%>;
  <%}%>
`)

module.exports = function EjsLoader(source) {
  const options = loaderUtils.getOptions(this) || {}
  const esModule = options.esModule !== false;

  ['escape', 'interpolate', 'evaluate'].forEach((templateSetting) => {
    const setting = options[templateSetting]
    if (setting && typeof setting === 'string') {
      options[templateSetting] = new RegExp(setting, 'g')
    }
  })

  const minifierCode = minify(source, {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: true,
  })

  return renderTpl({
    esModule,
    runtimePath,
    content: lodashTemplate(minifierCode, options),
  })
}
