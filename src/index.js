import React from './react/react'
import ReactDOM from './react/react-dom'

class Counter extends React.Component{
  state = {
    num: 0
  } 
  add = () => {
    this.setState({
      num: this.state.num + 1
    })
    console.log(this.state.num)
  }
  render(){
    return React.createElement(
      'div',
      null, 
      React.createElement('p',null, this.state.num),
      React.createElement('button',{onclick: this.add},'+')
    )
    // return (
    //   <div>
    //     <p>{this.state.num}</p>
    //     <button onClick={this.add}>+</button>
    //   </div>
    // )
  }
}

// class XX extends React.Component{
//   render(){
//     return React.createElement('div',null,'hello')
//   }
// }

ReactDOM.render(React.createElement(Counter,{}), document.getElementById('root'))
