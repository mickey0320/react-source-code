import React from './react/react'
import ReactDOM from './react/react-dom'
// import React from 'react'
// import ReactDOM from 'react-dom'

class SubCounter extends React.Component{
  componentWillMount(){
    console.log('SubCounter 1.componentWillMount')
  }
  render(){
    console.log('SubCounter 2.render')
    return React.createElement('div',{},this.props.num)
  }
  componentDidMount(){
    console.log('SubCounter 3.componentDidMount')
  }
}
class Counter extends React.Component{
  state = {
    num: 0
  } 
  componentWillMount(){
    console.log('Counter 1.componentWillMount')
  }
  componentDidMount(){
    console.log('Counter 3.componentDidMount')
  }
  // shouldComponentUpdate(nextProps,nextState){
  //   console.log('Counter 4.shouldComponentUpdate')
  //   return nextState.num%2 === 0
  // }
  componentWillUpdate(){
    console.log('Counter 5.componentWillUpdate')
  }
  componentDidUpdate(){
    console.log('Counter 6.componentDidUpdate')
  }
  add = () => {
    this.setState({
      num: this.state.num + 1
    })
  }
  render(){
    console.log('Counter 2.render')
    return React.createElement(
      'div',
      null, 
      React.createElement('p',null, this.state.num),
      React.createElement(SubCounter,{num: this.state.num}),
      React.createElement('button',{onClick: this.add},'+')
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
