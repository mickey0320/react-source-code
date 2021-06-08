import { REACT_TEXT } from "./constants"
import addEvent from "./event"

function render(vdom, container){
  const dom = createDOM(vdom)
  container.appendChild(dom)
}

function createDOM(vdom){
  const {type, props} = vdom
  // 文本节点
  if(type === REACT_TEXT){
    return document.createTextNode(props.content)
  }
  // 原生的节点
  if(typeof type === 'string'){
    const el = document.createElement(type)
    updateProps(props, el)
    if(props.children){
      if(Array.isArray(props.children)){
        reconcileChildren(props.children, el)
      }else{
        render(props.children, el)
      }
    }
    vdom.dom = el
    return el
  }else if(typeof type === 'function'){
    if(type.isReactComponent){// 类组件
      return mountClassComponent(vdom)
    }else{// 函数组件
      return mountFunctionComponent(vdom)
    }
  }
}

function mountFunctionComponent(vdom){
  const {type, props} = vdom
  const renderVdom = type(props)

  return createDOM(renderVdom)
}

function mountClassComponent(vdom){
  const {type, props} = vdom
  const classInstance = new type(props)
  const renderVdom = classInstance.render()
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom

  return createDOM(renderVdom)
}

function updateProps(props,el){
  for(let key in props){
    if(key === 'children') continue
    if(key === 'style'){
      for(let s in props['style']){
        el.style[s] = props['style'][s]
      }
    }else if(key.startsWith('on')){
      addEvent(el, key.toLocaleLowerCase(), props[key])
    }else{
      el.setAttribute(key, props[key])
    }
  }
}

function reconcileChildren(children,parent){
  children.forEach(childVDom => {
    render(childVDom, parent)
  })
}

// 根据虚拟dom找到真实的dom
function findDOM(vdom){
    const {type} = vdom 
    if(typeof type === 'function'){
      return findDOM(vdom.oldRenderVdom)
    }else{
      return vdom.dom
    }
}
function compareTwoVdom(parent,oldVdom,newVdom){
  const oldDOM = findDOM(oldVdom)
  const newDOM = createDOM(newVdom)
  parent.replaceChild(newDOM, oldDOM)
}

const ReactDOM = {
  render,
  findDOM,
  compareTwoVdom
}
export default ReactDOM