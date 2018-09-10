import React, {Component} from 'react'
import { history } from '../../store'

class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {
      shake: '',
      error: ''
    }

    this.submitLogin = this.submitLogin.bind(this);
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  submitLogin (e) {
    let username = this.usernameRef.current.value;
    let password = this.passwordRef.current.value;

    if(!username || !password) {
      this.setState({
        shake: 'shake-it'
      })
      setTimeout(() => {
          this.setState({
            shake: ''
          }) 
      }, 1000);
      if(!username) {
        this.setState({
          error: 'Please enter username'
        })
      } else if(!password) {
        this.setState({
          error: 'Please enter password'
        })
      }
    } else if (username !== 'admin' || password !== 'admin') {
      this.usernameRef.current.value = '';
      this.passwordRef.current.value = '';
      this.setState({
        error: 'Please enter correct username and password'
      })
    } else {
      history.push('/home');
    }
    e.preventDefault();
  }

  render() {
    return (
      <div className={`log-form ${this.state.shake}`}>
        <h2>Login</h2>
        { this.state.error && <div className="user-error">{this.state.error}</div> }
        <form>
          <input type="text" title="username" placeholder="Username" ref={this.usernameRef} />
          <input type="password" title="username" placeholder="Password" ref={this.passwordRef} />
          <button type="submit" className="btn" onClick={this.submitLogin}>Login</button>
        </form>
      </div>
    )
  }
}

export default Login
