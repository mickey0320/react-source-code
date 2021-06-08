import reactDOM  from './react-dom'
const {compareTwoVdom,findDOM} = reactDOM

export const updateQueue = {
  isBatchingUpdate: false,
  updaters: [],
  batchUpdate(){
    this.updaters.forEach(updater => {
      updater.updateComponent()
    })
    this.isBatchingUpdate = false
    this.updaters.length = 0
  }
}
class Updater{
  constructor(classInstance){
    this.classInstance = classInstance
    this.pendingStates = []
    this.callbacks = []
  }
  addState(partialState, callback){
    this.pendingStates.push(partialState)
    if(typeof callback === 'function'){
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }
  emitUpdate(){
    if(updateQueue.isBatchingUpdate){
      updateQueue.updaters.push(this)
    }else{
      this.updateComponent()
    }
  }
  updateComponent(){
    const {pendingStates, classInstance} = this
    if(pendingStates.length){
      shouldUpdate(classInstance, this.getState())
    }
  }
  getState(){
    let state = this.classInstance.state
    for(let i = 0; i < this.pendingStates.length; i++){
      let nextState = this.pendingStates[i]
      if(typeof nextState === 'function'){
        nextState = nextState(state)
      }
      state = { ...state,...nextState}
    }
    this.pendingStates.length = 0

    return state
  }
}

function shouldUpdate(classInstance, newState){
  classInstance.state = newState
  classInstance.forceUpdate()
}
class Component{
  static isReactComponent = true
  constructor(props){
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }
  setState(partialState,callback){
    this.updater.addState(partialState, callback)
  }
  forceUpdate(){
    const oldRenderVdom = this.oldRenderVdom
    const newRenderVdom = this.render()
    const parent = findDOM(oldRenderVdom).parentNode
    compareTwoVdom(parent,oldRenderVdom,newRenderVdom)
    this.oldRenderVdom = newRenderVdom
  }
}

export default Component