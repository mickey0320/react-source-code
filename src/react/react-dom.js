import { REACT_TEXT } from "./constants"

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
  }else if(typeof type === 'function'){// 函数组件
    return mountFunctionComponent(vdom)
  }else if( typeof type === 'function' && type.isReractComponent){// 类组件
    return mountClassComponent(vdom)
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
  const v = classInstance.render()

  return createDOM(v)
}

function updateProps(props,el){
  for(let key in props){
    if(key === 'children') continue
    if(key === 'style'){
      for(let s in props['style']){
        el.style[s] = props['style'][s]
      }
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


const ReactDOM = {
  render
}
export default ReactDOM