webpackJsonp([1],{

/***/ "./src/assets/static.jpeg":
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIACgAKAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APYRwzDgM2EXHoO/+farGKp27xvdmRgN5jXJ7cE8frU9zcrbWj3DA7EUsfpTozjZyMJxd7EvfFJkZxkVyGmeIlvnaaSRkjf59zjaqp2yen/66W41aR9Qigtbd54GGTPEy4H5nJH0zXPLMLaqOh0xwTe7OuKgjFM8pP7tcvYeIxZanLp99IPL3Dy5CcbQR3re/trS/wDn/tv+/grqpYqFSPMmc9XDThKzRhWd8sdndCKXdIvQE9yKxfHWtzQeD7+WK4wgjAJ7sSwAA/DOaq218oZ3yNgUgAdypGP0pt7eWktl5VxDHLC6b9rqG56g4P0FfOU60lZdD03TTd2ctqt9Y33wnSSWRopQkSqM8lkCgcd8nd+YrX8CeINOtvCWmRRF5bky/Z/LIOcsSScnsFyfwrAutUgtI2higxGgADKM7OGzj88fTNM0m7Z9d0+diVS3jkUZjOSxAx9OMGumpUvTd9Dop0V8SZvXMNzq/jvUbNgyQ4TE2PlVAoyf0P6Vqf8ACF2X/QWH5Ve0CS2fVCtyeZo2UsK6b+y9N/56t+dZ0FGcOZrX1M8RVq05csHZeh5fY6g6yLGcYYMuQcD5lwP5j8qJZGW1jjYDBTJB5I5P9D0qjb/6yH/fWrd10H0b+ZrFJKVit2iN7eJLEFRl925semTn+RqvayW0l/IuwjG105PykDH8gPyq43/Hq3/XP/4qsmx/5CLf7n9GoSunc6F0OntZG/tCLycEjnI/wroPtV76N+Vc3pX/ACFV+i11dZRbWzHNJvVH/9k="

/***/ }),

/***/ "./src/main.jsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _util = __webpack_require__("./src/libs/util.jsx");

var _renderNav = __webpack_require__("./src/templates/render-nav.twig");

var _renderNav2 = _interopRequireDefault(_renderNav);

var _static = __webpack_require__("./src/assets/static.jpeg");

var _static2 = _interopRequireDefault(_static);

__webpack_require__("./src/main.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/no-unresolved */

(0, _util.getElement)('takla-main').innerHTML = (0, _renderNav2.default)({
  currentDate: new Date()
});

// mock react
var React = {
  createElement: function createElement() {
    return null;
  }

  // console.error(
  //   <div></div>
  // );

};setTimeout(function () {
  var asyncModule = __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/templates/ajax.twig")); // or `require.ensure`
  var onSuccess = function onSuccess(renderTpl) {
    (0, _util.setInnerHTML)((0, _util.getElement)('takla-async'), renderTpl({
      globalData: Window.globalData,
      imgUrl: _static2.default
    }));
  };

  asyncModule.then(onSuccess);
}, 1500);

/***/ }),

/***/ "./src/main.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/templates/render-nav.twig":
/***/ (function(module, exports, __webpack_require__) {

var twig = __webpack_require__("../../node_modules/_twig@1.13.2@twig/twig.js").twig,
    template = twig({"id":"43818c0201c6af6506ccfa30722983a635afd4a84bfa1cfb401af96831d0d405ec019f8072f8d36a51c7c47839fa98d44e4426ba9b88133933af8997a0f5fc7d","data":[{"type":"raw","value":"<div align=\"center\">\n  <h1>Layout rendered</h1>\n  <div id=\"takla-async\">\n    <div class=\"loading\">\n      <span></span>\n      <span></span>\n      <span></span>\n      <span></span>\n      <span></span>\n    </div>\n  </div>\n  <br>\n  <br>\n  <br>\n  <p>"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"currentDate","match":["currentDate"]}]},{"type":"raw","value":"</p>\n</div>\n"}],"allowInlineIncludes":true,"rethrow":true});

module.exports = function(context) { return template.render(context); }

/***/ })

},["./src/main.jsx"]);
//# sourceMappingURL=main.js.map