import {useState} from 'react'
import Cookies from 'js-cookie'
import {useHistory} from 'react-router-dom'

import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [failureMsg, setFailureMsg] = useState('')

  const history = useHistory()

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const successfulLogin = jwtToken => {
    Cookies.set('jwtToken', jwtToken, {expires: 5})
    history.replace('/')
  }

  const onClickLogin = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const loginApi = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginApi, options)
    const data = await response.json()
    if (response.ok) {
      successfulLogin(data.jwt_token)
    } else {
      setFailureMsg(data.error_msg)
    }
  }

  return (
    <div className="login-section">
      <img
        src="https://res.cloudinary.com/dg14m0ern/image/upload/v1718973250/Illustration_dw4ndj.jpg"
        alt="loginImage"
        className="login-image"
      />
      <form onSubmit={onClickLogin} className="login-form-bg">
        <img
          src="https://res.cloudinary.com/dg14m0ern/image/upload/v1718973234/Standard_Collection_8_ikvoci.png"
          alt="logo"
          className="login-logo"
        />
        <h1 className="logo-title">Insta Share</h1>
        <label htmlFor="username" className="label-style">
          USERNAME
        </label>
        <input
          id="username"
          type="text"
          placeholder="username"
          className="input-box"
          value={username}
          onChange={onChangeUsername}
        />
        <label htmlFor="password" className="label-style">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          placeholder="password"
          className="input-box"
          value={password}
          onChange={onChangePassword}
        />
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="failure-msg">{failureMsg}</p>
      </form>
    </div>
  )
}

export default Login
