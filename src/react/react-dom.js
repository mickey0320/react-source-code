import { REACT_FORWORD_REF_TYPE, REACT_TEXT } from "./constants"
import addEvent from "./event"

function render(vdom, container){
  const dom = createDOM(vdom)
  container.appendChild(dom)
  if(dom.componentDidMount){
    dom.componentDidMount()
  }
}

function createDOM(vdom){
  const {type, props,ref} = vdom
  // 文本节点
  if(type === REACT_TEXT){
    const dom = document.createTextNode(props.content)
    vdom.dom = dom

    return dom
  }
  // 原生的节点
  if(typeof type === 'string'){
    const el = document.createElement(type)
    if(ref){
      ref.current = el 
    }
    if(props){
      updateProps(el,props)
    }
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
  }else if(type.$$typeof === REACT_FORWORD_REF_TYPE){
    return mountForwardComponent(vdom)
  }
}

function mountFunctionComponent(vdom){
  const {type, props} = vdom
  const renderVdom = type(props)
  vdom.oldRenderVdom = renderVdom

  return createDOM(renderVdom)
}

function mountClassComponent(vdom){
  const {type, props,ref} = vdom
  const defaultProps = type.defaultProps || {}
  const classInstance = new type({...defaultProps,...props})
  vdom.classInstance = classInstance
  if(classInstance.componentWillMount){
    classInstance.componentWillMount()  
  }
  if(ref){
    ref.current = classInstance
  }
  const renderVdom = classInstance.render()
  
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom

  let dom = createDOM(renderVdom)
  if(classInstance.componentDidMount){
    dom.componentDidMount = classInstance.componentDidMount.bind(this)
  }

  return dom
}

function mountForwardComponent(vdom){
  const {render,props, ref} = vdom
  const renderVdom = render(props,ref)
  vdom.oldRenderVdom = renderVdom

  return createDOM(renderVdom)
}

function updateProps(el,props){
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
function compareTwoVdom(parent,oldVdom,newVdom,nextDOM){
 if(!oldVdom && !newVdom) {
  return null
 }
 if(oldVdom && !newVdom){
   const currentDOM = findDOM(oldVdom)
    currentDOM.parentNode.removeChild(currentDOM)
    if(oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount){
      oldVdom.classInstance.componentWillUnmount()
    }
 }else if(!oldVdom && newVdom){
   const newDOM = createDOM(newVdom)
   if(nextDOM){
    parent.insertBefore(newDOM, nextDOM)
   }else{
    parent.appendChild(newDOM) 
   }
  return newVdom
 }else if(oldVdom && newVdom && oldVdom.type !== newVdom.type){
    const oldDOM = findDOM(oldVdom)
    const newDOM = createDOM(newVdom)
    parent.replaceChild(newDOM,oldDOM)
    if(oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount){
      oldVdom.classInstance.componentWillUnmount()
    }
    return newVdom
 }else{
  updateElement(oldVdom,newVdom)
 }
}

function updateElement(oldVdom,newVdom){
  if(oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT){
    if(oldVdom.props.content !== newVdom.props.content){
      const currentDOM = findDOM(oldVdom)
      newVdom.dom = currentDOM
      currentDOM.textContent = newVdom.props.content
    }
  }else if(typeof oldVdom.type === 'string'){
    const currentDOM = newVdom.dom = findDOM(oldVdom)
    updateProps(currentDOM, oldVdom.props,newVdom.props)
    updateChildren(currentDOM, oldVdom.props.children,newVdom.props.children)
  }else if(typeof oldVdom.type === 'function'){
    if(oldVdom.type.isReactComponent){
      updateClassComponent(oldVdom,newVdom)
    }else{
      updateFunctionComponent(oldVdom,newVdom)
    }
  }
}

function updateFunctionComponent(oldVdom,newVdom){
  const {type} = oldVdom
  const parentDOM = findDOM(oldVdom).parentNode
  const renderVdom = type(newVdom.props)
  newVdom.oldRenderVdom = renderVdom
  compareTwoVdom(parentDOM,oldVdom.oldRenderVdom,renderVdom)
}

function updateClassComponent(oldVdom,newVdom){
  const { classInstance} = oldVdom
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom
  newVdom.classInstance = oldVdom.classInstance
  if(classInstance.componentWillReceiveProps){
   classInstance.componentWillReceiveProps(newVdom.props) 
  }
  classInstance.updater.emitUpdate(newVdom.props)
}

function updateChildren(parentDOM, oldVChildren, newVChildren){
  oldVChildren = Array.isArray(oldVChildren)? oldVChildren: [oldVChildren]
  newVChildren = Array.isArray(newVChildren)? newVChildren: [newVChildren]
  const maxLength = Math.max(oldVChildren.length,newVChildren.length)
  for(let i =0; i < maxLength;i++){
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i])
  }
}
// function compareTwoVdom(parent,oldVdom,newVdom){
//   const oldDOM = findDOM(oldVdom)
//   const newDOM = createDOM(newVdom)
//   parent.replaceChild(newDOM, oldDOM)
// }



const ReactDOM = {
  render,
  findDOM,
  compareTwoVdom,
}
export default ReactDOM