/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
// some utils

export const getElement = (id) => document.getElementById(id)
export const setInnerHTML = (element, content) => {
  if (element && element.nodeType) {
    element.innerHTML = content
  }
}
