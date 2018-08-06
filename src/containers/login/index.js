import React from 'react'
import { history } from '../../store'

const Login = () => (
  <div class="log-form">
    <h2>Login</h2>
    <form>
      <input type="text" title="username" placeholder="username" />
      <input type="password" title="username" placeholder="password" />
      <button type="submit" class="btn" onClick={() => history.push('/home')}>Login</button>
    </form>
  </div>
)

export default Login
