/* eslint-disable */
/* EJS_INTERNAL_RUNTIME_MODULE_ES2015_ONLY */
/* WARNING: ES5 ONLY!! */
/* WARNING: ES5 ONLY!!! */
/* WARNING: ES5 ONLY!!!! */
/* WARNING: ES5 ONLY!!!!! */
var replacer = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
module.exports = {
  escape: function escape(string) {
    if (string && typeof string === 'string') {
      return string.replace(/([&<>"])/g, function (m, value) {
        return replacer[value] || value;
      });
    }
    return string;
  }
};
