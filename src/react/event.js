import {updateQueue} from './Component'
function addEvent(dom,eventType, handler){
  const store = dom.store || (dom.store = {})
  store[eventType] = handler
  if(!document[eventType]){
    document[eventType] = dispatchEvent
  }
}

function dispatchEvent(e){
  let {target,type} = e
  if(!target.store) return
  const eventType = `on${type}`
  updateQueue.isBatchingUpdate = true
  while(target){
    const store = target.store
    const handler = store && store[eventType]
    handler && handler.call(target, createSyntheticEvent(e))
    target = target.parentNode
  }
  updateQueue.batchUpdate()
  updateQueue.isBatchingUpdate = false
}

function createSyntheticEvent(e){
  const syntheticEvent = {}
  for(let key in e){
    syntheticEvent[key] = e[key]
  }

  return syntheticEvent
}

export default addEvent