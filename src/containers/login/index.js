import React, {Component} from 'react'
import { history } from '../../store'

class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {
      shake: ''
    }

    this.submitLogin = this.submitLogin.bind(this)
  }

  submitLogin (e) {
    this.setState({
      shake: 'shake-it'
    })
    setTimeout(() => {
        this.setState({
          shake: ''
        }) 
    }, 1000)
    // history.push('/home')
    e.preventDefault();
  }

  render() {
    return (
      <div className={`log-form ${this.state.shake}`}>
        <h2>Login</h2>
        <form>
          <input type="text" title="username" placeholder="username" />
          <input type="password" title="username" placeholder="password" />
          <button type="submit" className="btn" onClick={this.submitLogin}>Login</button>
        </form>
      </div>
    )
  }
}

export default Login
