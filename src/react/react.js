import {wrapToVdom} from './util'
import Component from './Component'

function createElement(type, config,children){
  const props = {...config}
  if(arguments.length <= 3){
    props.children = wrapToVdom(children)
  }else{
    props.children = Array.from(arguments).slice(2).map(wrapToVdom)
  }
  return {
    type,
    props,
  }
}
const React = {
  createElement,
  Component
}
export default React