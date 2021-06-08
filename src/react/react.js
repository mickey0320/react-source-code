import {wrapToVdom} from './util'
import Component from './Component'
import { REACT_FORWORD_REF_TYPE } from './constants'

function createElement(type, config,children){
  let ref
  let key
  if(config){
    ref = config.ref
    delete config.ref
    key = config.key
    delete config.key
  }
  const props = {...config}
  if(arguments.length <= 3){
    props.children = wrapToVdom(children)
  }else{
    props.children = Array.from(arguments).slice(2).map(wrapToVdom)
  }
  return {
    type,
    props,
    ref,
    key,
  }
}
function createRef(){
  return {current: null}
}

function forwardRef(render){
  return {
    $$typeof: REACT_FORWORD_REF_TYPE,
    render
  }
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef
}
export default React