webpackJsonp([2],{

/***/ "./src/libs/util.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
// some utils

var getElement = exports.getElement = function getElement(id) {
  return document.getElementById(id);
};
var setInnerHTML = exports.setInnerHTML = function setInnerHTML(element, content) {
  if (element && element.nodeType) {
    element.innerHTML = content;
  }
};

/***/ }),

/***/ "./src/vendors/vendor-exten.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _util = __webpack_require__("./src/libs/util.jsx");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ })

},["./src/vendors/vendor-exten.js"]);
//# sourceMappingURL=vendor-exten.js.map