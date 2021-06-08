import React from './react/react'
import ReactDOM from './react/react-dom'

// const ele = (
//   <div style={{color:'red'}}>test</div>
// )
function Hello(props){
  return React.createElement('h1',null,props.name)
  // return <h1>{props.name}</h1>
}
// const ele = React.createElement('div',{style:{color:'red'}},'test')
const ele = React.createElement(Hello,{name:'react'})

ReactDOM.render(ele, document.getElementById('root'))
