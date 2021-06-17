import isObject from 'is-object'
import isNumber from 'is-number'

import './index.scss'

const fn = () => {
  document.body.innerHTML = '阿里巴巴'
  if (isObject(document)) {
    isNumber(document)
  }
}

document.body = fn()
