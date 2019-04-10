/* eslint-disable import/no-unresolved */

import { getElement, setInnerHTML } from '@/libs/util'
import renderNav from '@/templates/render-nav.twig'
import logo from '@/assets/static.jpeg'

import './main.scss'

getElement('takla-main').innerHTML = renderNav({
  currentDate: new Date(),
})

// mock react
const React = {
  createElement: () => null
}

// console.error(
//   <div></div>
// );

setTimeout(() => {
  const asyncModule = import('@/templates/ajax.twig')  // or `require.ensure`
  const onSuccess = (renderTpl) => {
    setInnerHTML(getElement('takla-async'), renderTpl({
      globalData: Window.globalData,
      imgUrl: logo,
    }))
  }

  asyncModule.then(onSuccess)
}, 1500)
