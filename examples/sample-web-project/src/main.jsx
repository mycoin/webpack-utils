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

// jsx mock
console.error(
  <div></div>
);

let index = 2

setInterval(() => {
  const asyncModule = import('@/templates/ajax.twig')  // or `require.ensure`
  const onSuccess = (renderTpl) => {
    setInnerHTML(getElement('takla-async'), renderTpl({
      globalData: Window.globalData,
      imgUrl: logo,
      indexCount: index *=2 ,
    }))
  }

  asyncModule.then(onSuccess)
}, 1000)
