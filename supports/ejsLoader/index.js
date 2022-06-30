/* eslint-disable max-len */
/* eslint-disable global-require, prefer-template */
const loaderUtils = require('loader-utils')
const lodashTemplate = require('lodash.template')

const runtimeFile = require.resolve('./runtime')
const renderEjs = lodashTemplate(`
  /*Loaded over EjsLoader*/
  const _ = require("<%=runtimeFile%>");
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

  return renderEjs({
    esModule,
    runtimeFile,
    content: lodashTemplate(source, options),
  })
}
